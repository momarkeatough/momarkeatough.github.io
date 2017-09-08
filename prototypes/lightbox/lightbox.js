/************************************
 * Lightbox functionality *
 ************************************/
window.moprototype = window.moprototype || {};

window.moprototype.imageLightbox = {
      
        overlayElement: null,
        overlayLightboxContainer: null,
        
        init: function() {
            this.overlayElement = document.getElementById("base-overlay");
            this.overlayContainer = document.getElementById("overlay-container");
            this.overlayLightboxContainer = document.getElementById("lightbox-container");
            this.overlayCaptionContainer = document.getElementById("caption-container");
            this.lightboxImages = document.getElementsByClassName("inlineImageLarge");
            this.numberOfImages = this.lightboxImages.length;
            this.currentImageId = 0;
            
            if( document.getElementById("wxDescription") !== null ) {
                document.getElementById("wxDescription").addEventListener("click", window.moprototype.imageLightbox.showLightbox);
            }
			
			var leftNav = document.getElementById("leftNav");
            var rightNav = document.getElementById("rightNav");

            // add navigation buttons if there is more than one image
            if( window.moprototype.imageLightbox.numberOfImages > 1) {
                leftNav.addEventListener("click", window.moprototype.imageLightbox.setPreviousImage);
                rightNav.addEventListener("click", window.moprototype.imageLightbox.setNextImage);
            }
            else {
                document.getElementById("leftNav").style.display = "none";
                document.getElementById("rightNav").style.display = "none";
            }
            
            // responsive swipe support
            var hammer = new Hammer(this.overlayElement);

            hammer.on("swipeleft", function(ev) {
                window.moprototype.imageLightbox.setPreviousImage();
            });

            hammer.on("swiperight", function(ev) {
                window.moprototype.imageLightbox.setNextImage();
            });
            
        },
        
        showLightbox: function(e) {

            if (e.target.nodeName === "IMG" && e.target.classList.contains("inlineImageSmall")) {
                var lightbox = window.moprototype.imageLightbox;
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
            var lightbox = window.moprototype.imageLightbox;
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
            var lightbox = window.moprototype.imageLightbox;
			
            // only hide the overlay when there is no event object (escape key pressed) or the navigation buttons are not clicked
            // this prevents clicking the nav buttons hiding the overlay
            if( typeof e === "undefined" || ! e.target.classList.contains("nav") ) {
                lightbox.overlayElement.style.display = "none";
                lightbox.overlayLightboxContainer.innerHTML = "";
                lightbox.overlayCaptionContainer.innerHTML = "";

                // remove event listeners so they don't continue to work when they are not needed
                document.removeEventListener("click", lightbox.hideOverlay);
                document.removeEventListener("keyup", lightbox.handleKeyboardNavigation);
            }
        },
    
        handleKeyboardNavigation: function(e) {
            var lightbox = window.moprototype.imageLightbox;
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
            var lightbox = window.moprototype.imageLightbox;
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
            var lightbox = window.moprototype.imageLightbox;
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
    window.moprototype.imageLightbox.init();
});