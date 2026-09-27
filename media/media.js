document.addEventListener("DOMContentLoaded", async () => {
    const folderGrid = document.getElementById("folderGrid");
    const foldersView = document.getElementById("foldersView");
    const photosView = document.getElementById("photosView");
    const photoGrid = document.getElementById("photoGrid");
    const emptyAlbum = document.getElementById("emptyAlbum");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const status = document.createElement("p");
    status.className = "media-status";
    status.setAttribute("role", "status");
    document.querySelector(".media-shell")?.append(status);

    let folders = [];
    let activeFolder = null;
    let activePhotoIndex = 0;

    const resolvePhoto = (photo) => new URL(photo.src, window.location.href).href;

    const renderFolders = () => {
        folderGrid.replaceChildren();
        document.getElementById("folderSummary").textContent = `${folders.length} album · nyisd meg a képek böngészéséhez`;
        folders.forEach((folder) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "folder-card";
            const cover = document.createElement("span");
            cover.className = "folder-cover";
            if (folder.photos.length) {
                const image = document.createElement("img");
                image.alt = "";
                image.loading = "lazy";
                image.src = resolvePhoto(folder.photos[0]);
                cover.append(image);
            } else {
                const placeholder = document.createElement("span");
                placeholder.className = "folder-placeholder";
                cover.append(placeholder);
            }
            const meta = document.createElement("span");
            meta.className = "folder-meta";
            const title = document.createElement("strong");
            title.textContent = folder.name;
            const count = document.createElement("span");
            count.textContent = `${folder.photos.length} kép`;
            meta.append(title, count);
            card.append(cover, meta);
            card.addEventListener("click", () => showFolder(folder.id));
            folderGrid.append(card);
        });
    };

    const showFolder = (folderId) => {
        activeFolder = folders.find((folder) => folder.id === folderId);
        if (!activeFolder) return;
        foldersView.hidden = true;
        photosView.hidden = false;
        document.getElementById("albumTitle").textContent = activeFolder.name;
        document.getElementById("albumSummary").textContent = `${activeFolder.photos.length} kép`;
        photoGrid.replaceChildren();
        emptyAlbum.hidden = activeFolder.photos.length !== 0;
        activeFolder.photos.forEach((photo, index) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "photo-card";
            const image = document.createElement("img");
            image.alt = photo.name;
            image.loading = "lazy";
            image.src = resolvePhoto(photo);
            const caption = document.createElement("span");
            caption.className = "photo-caption";
            caption.textContent = photo.name;
            card.append(image, caption);
            card.addEventListener("click", () => openLightbox(index));
            photoGrid.append(card);
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openLightbox = (index) => {
        activePhotoIndex = (index + activeFolder.photos.length) % activeFolder.photos.length;
        const photo = activeFolder.photos[activePhotoIndex];
        lightboxImage.src = resolvePhoto(photo);
        lightboxImage.alt = photo.name;
        lightboxCaption.textContent = `${photo.name} · ${activePhotoIndex + 1} / ${activeFolder.photos.length}`;
        if (!lightbox.open) lightbox.showModal();
    };

    const closeLightbox = () => {
        if (lightbox.open) lightbox.close();
        lightboxImage.removeAttribute("src");
    };

    document.getElementById("backToFolders").addEventListener("click", () => {
        photosView.hidden = true;
        foldersView.hidden = false;
        activeFolder = null;
    });
    document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
    document.getElementById("previousPhoto").addEventListener("click", () => openLightbox(activePhotoIndex - 1));
    document.getElementById("nextPhoto").addEventListener("click", () => openLightbox(activePhotoIndex + 1));
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") openLightbox(activePhotoIndex - 1);
        if (event.key === "ArrowRight") openLightbox(activePhotoIndex + 1);
    });

    try {
        const response = await fetch("gallery.json", { cache: "no-store" });
        if (!response.ok) throw new Error("A galéria adatai nem érhetők el.");
        const gallery = await response.json();
        folders = Array.isArray(gallery.albums) ? gallery.albums : [];
        renderFolders();
        const requestedAlbum = new URLSearchParams(window.location.search).get("album");
        if (requestedAlbum && folders.some((folder) => folder.id === requestedAlbum)) showFolder(requestedAlbum);
    } catch {
        status.textContent = "A képgaléria jelenleg nem érhető el. Töltsd újra az oldalt később.";
    }
});
