/************************************
 * Lightbox functionality *
 ************************************/
window.metoffice = window.metoffice || {};

window.metoffice.imageLightbox = {
      
        overlayElement: null,
        overlayElementContainer: null,
        
        init: function() {
            this.overlayElement = document.getElementById("base-overlay");
            this.overlayElementContainer = document.getElementById("lightbox-container");
            this.overlayCaptionContainer = document.getElementById("caption-container");
            this.lightboxImages = document.getElementsByClassName("inlineImageLarge");
            this.numberOfImages = this.lightboxImages.length;
            this.currentImageId = 0;
            
            // event listener for desktop
            if( document.getElementById("wxDescription") !== null ) {
                document.getElementById("wxDescription").addEventListener("click", window.metoffice.imageLightbox.showLightbox);
            } 
            
            // responsive swipe support
            var hammer = new Hammer(this.overlayElement);

            hammer.on("swipeleft", function(ev) {
                window.metoffice.imageLightbox.setPreviousImage();
            });

            hammer.on("swiperight", function(ev) {
                window.metoffice.imageLightbox.setNextImage();
            });
            
        },
        
        showLightbox: function(e) {

            if (e.target.nodeName === "IMG" && e.target.classList.contains("inlineImageSmall")) {
                var lightbox = window.metoffice.imageLightbox;
                var imageId = e.target.getAttribute("data-lightbox-image-id");
                
                // prevent modal window from instantly closing and link from being followed
                e.stopPropagation();    // prevent instant close 
                e.preventDefault();
                lightbox.overlayElement.style.display = "block";

                // update current image id to be this one and display the image
                lightbox.currentImageId = imageId;
                lightbox.showImage(imageId);

                // add event listeners for hiding the overlay and keyboard navigation of the lightbox
                document.addEventListener("click", lightbox.hideOverlay);
                // use keyup instead of keydown to prevent rapid transition of images
                document.addEventListener("keyup", lightbox.handleKeyboardNavigation)
            }
        },
    
        showImage: function(imageNumber) {
            var lightbox = window.metoffice.imageLightbox;
            var largeImageAnchor = document.querySelector("a[data-lightbox-image-id='" + imageNumber + "']");
            var inlineImage = document.querySelector("img[data-lightbox-image-id='" + imageNumber + "']");

            // remove any existing image
            lightbox.overlayElementContainer.innerHTML = "";
            lightbox.overlayCaptionContainer.innerHTML = "";
            
            if(largeImageAnchor !== null) {
                var enlargedImage = document.createElement("img");
                enlargedImage.src = largeImageAnchor.getAttribute("href");
                lightbox.overlayElementContainer.appendChild(enlargedImage);

                var captionContainer = document.createElement("div");
                captionContainer.setAttribute("class", "caption");

                if( inlineImage.getAttribute("alt") !== null) {
                    captionContainer.textContent = inlineImage.getAttribute("alt");
                }
                else {
                    captionContainer.textContent = "";
                }

                lightbox.overlayCaptionContainer.appendChild(captionContainer);
            }
        },

        hideOverlay: function() {
            var lightbox = window.metoffice.imageLightbox;
            lightbox.overlayElement.style.display = "none";
            lightbox.overlayElementContainer.innerHTML = "";
            lightbox.overlayCaptionContainer.innerHTML = "";
            
            // remove event listeners so they don't continue to work when they are not needed
            document.removeEventListener("click", lightbox.hideOverlay);
            document.removeEventListener("keyup", lightbox.handleKeyboardNavigation);
        },
    
        handleKeyboardNavigation: function(e) {
            var lightbox = window.metoffice.imageLightbox;
            switch (e.keyCode) {
                // left
                case 37:
                    lightbox.setPreviousImage();
                    e.preventDefault();  // prevent window scroll
                    break;
                // right
                case 39:
                    lightbox.setNextImage();
                    e.preventDefault();  // prevent window scroll
                    break;
                // escape
                case 27:
                    lightbox.hideOverlay();
                    break;
                default:
                    e.preventDefault();  // prevent window scroll
                    // no action to take on other key presses
                    break;
            }
        },
    
        setNextImage: function() {
            var lightbox = window.metoffice.imageLightbox;
            // handle max number of lightbox images being exceeded 
            if (lightbox.currentImageId >= lightbox.numberOfImages) {
                lightbox.currentImageId = 1;
            }
            else {
                lightbox.currentImageId++;
            }

            lightbox.showImage(lightbox.currentImageId);
        },
    
        setPreviousImage: function() {
            var lightbox = window.metoffice.imageLightbox;
            // handle min number of lightbox images being exceeded 
            if (lightbox.currentImageId <= 1) {
                lightbox.currentImageId = lightbox.numberOfImages;
            }
            else {
                lightbox.currentImageId--;
            }

            lightbox.showImage(lightbox.currentImageId);
        }

};

window.addEventListener('DOMContentLoaded', function() {
    window.metoffice.imageLightbox.init();
});