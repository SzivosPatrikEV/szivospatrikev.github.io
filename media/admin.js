document.addEventListener("DOMContentLoaded", () => {
    const repository = "PatrikSzivos0528/pteszgy-new";
    const manifestPath = "media/gallery.json";
    const apiRoot = "https://api.github.com";
    const loginForm = document.getElementById("loginForm");
    const loginPanel = document.getElementById("loginPanel");
    const toolsPanel = document.getElementById("adminTools");
    const tokenInput = document.getElementById("githubToken");
    const loginButton = document.getElementById("loginButton");
    const status = document.getElementById("adminStatus");
    const albumForm = document.getElementById("createAlbumForm");
    const albumName = document.getElementById("albumName");
    const uploadForm = document.getElementById("uploadForm");
    const albumSelect = document.getElementById("albumSelect");
    const photoInput = document.getElementById("adminPhotos");
    const uploadButton = document.getElementById("uploadButton");

    let token = "";
    let branch = "";
    let manifest = null;
    let manifestSha = "";

    const setStatus = (message, isError = false) => {
        status.textContent = message;
        status.classList.toggle("error", isError);
    };

    const request = async (path, options = {}) => {
        const response = await fetch(`${apiRoot}${path}`, {
            ...options,
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
                "X-GitHub-Api-Version": "2022-11-28",
                ...(options.headers || {})
            }
        });
        const result = response.status === 204 ? null : await response.json().catch(() => null);
        if (!response.ok) {
            const message = result?.message || `GitHub API error (${response.status})`;
            throw new Error(message);
        }
        return result;
    };

    const contentsEndpoint = (path) => `/repos/${repository}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;

    const decodeBase64Utf8 = (value) => {
        const binary = atob(value.replace(/\s/g, ""));
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    };

    const encodeFile = async (file) => {
        const bytes = new Uint8Array(await file.arrayBuffer());
        let binary = "";
        const chunkSize = 0x8000;
        for (let offset = 0; offset < bytes.length; offset += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
        }
        return btoa(binary);
    };

    const refreshAlbumOptions = () => {
        albumSelect.replaceChildren();
        manifest.albums.forEach((album) => {
            const option = document.createElement("option");
            option.value = album.id;
            option.textContent = album.name;
            albumSelect.append(option);
        });
    };

    const saveManifest = async (message) => {
        const result = await request(contentsEndpoint(manifestPath), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                content: btoa(unescape(encodeURIComponent(`${JSON.stringify(manifest, null, 2)}\n`))),
                sha: manifestSha,
                branch
            })
        });
        manifestSha = result.content.sha;
        return result;
    };

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        token = tokenInput.value.trim();
        if (!token) return;
        loginButton.disabled = true;
        setStatus("GitHub-hozzáférés ellenőrzése…");
        try {
            const repo = await request(`/repos/${repository}`);
            branch = repo.default_branch || "main";
            const manifestFile = await request(`${contentsEndpoint(manifestPath)}?ref=${encodeURIComponent(branch)}`);
            manifestSha = manifestFile.sha;
            manifest = JSON.parse(decodeBase64Utf8(manifestFile.content));
            if (!Array.isArray(manifest.albums)) throw new Error("A galéria manifest formátuma hibás.");
            document.getElementById("signedInAs").textContent = "GitHub repository-hozzáférés ellenőrizve";
            refreshAlbumOptions();
            loginPanel.hidden = true;
            toolsPanel.hidden = false;
            tokenInput.value = "";
            setStatus("Belépés sikeres. A feltöltések a GitHub repositoryba kerülnek.");
        } catch (error) {
            token = "";
            tokenInput.value = "";
            setStatus(`Nem sikerült belépni: ${error.message}. Ellenőrizd a tokent és a repository Contents jogosultságát.`, true);
        } finally {
            loginButton.disabled = false;
        }
    });

    albumForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = albumName.value.trim();
        if (!name) return;
        if (manifest.albums.some((album) => album.name.toLocaleLowerCase("hu") === name.toLocaleLowerCase("hu"))) {
            setStatus("Már van ilyen nevű album.", true);
            return;
        }
        const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "album";
        const album = { id: `${slug}-${Date.now()}`, name, photos: [] };
        const submitButton = albumForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        try {
            manifest.albums.push(album);
            await saveManifest(`Galéria album létrehozása: ${name}`);
            refreshAlbumOptions();
            albumSelect.value = album.id;
            albumName.value = "";
            setStatus(`Az „${name}” album létrejött. Néhány perc múlva megjelenik a nyilvános galériában.`);
        } catch (error) {
            manifest.albums = manifest.albums.filter((item) => item.id !== album.id);
            setStatus(`Nem sikerült létrehozni az albumot: ${error.message}`, true);
        } finally {
            submitButton.disabled = false;
        }
    });

    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const album = manifest.albums.find((item) => item.id === albumSelect.value);
        const files = Array.from(photoInput.files || []);
        if (!album || !files.length) return;
        const invalid = files.find((file) => !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024);
        if (invalid) {
            setStatus(`„${invalid.name}” nem képfájl vagy nagyobb 8 MB-nál.`, true);
            return;
        }

        uploadButton.disabled = true;
        let uploaded = 0;
        const safeAlbum = album.id.replace(/[^a-z0-9-]/gi, "-");
        try {
            for (const [index, file] of files.entries()) {
                setStatus(`Feltöltés: ${index + 1} / ${files.length} · ${file.name}`);
                const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
                const storedName = `${Date.now()}-${index + 1}-${safeName || "photo.jpg"}`;
                const filePath = `media/uploads/${safeAlbum}/${storedName}`;
                await request(contentsEndpoint(filePath), {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: `Galéria fotó feltöltése: ${file.name}`,
                        content: await encodeFile(file),
                        branch
                    })
                });
                album.photos.push({ name: file.name, src: `uploads/${safeAlbum}/${storedName}` });
                uploaded += 1;
            }
            setStatus("A galéria adatainak mentése…");
            await saveManifest(`${uploaded} fotó hozzáadása: ${album.name}`);
            photoInput.value = "";
            setStatus(`${uploaded} kép sikeresen feltöltve az „${album.name}” albumba. A nyilvános galéria frissül, amikor a GitHub Pages közzéteszi a módosításokat.`);
        } catch (error) {
            setStatus(`${uploaded} kép már felkerült a repositoryba, de a galéria frissítése nem sikerült: ${error.message}. Jelentkezz be újra vagy próbáld ismét.`, true);
        } finally {
            uploadButton.disabled = false;
        }
    });

    document.getElementById("logoutButton").addEventListener("click", () => {
        token = "";
        branch = "";
        manifest = null;
        manifestSha = "";
        toolsPanel.hidden = true;
        loginPanel.hidden = false;
        tokenInput.value = "";
        setStatus("Kiléptél. A GitHub token törölve lett ebből az oldalból.");
    });
});
