// Script

const navLinks = document.querySelectorAll("header nav ul li a");
// Margin of every section linked with navigation links
const navLinkTargetMargin = 150;


window.addEventListener("load", function() {
    let doneResizing;
    
    // Event handler when clicking navigation button
    navLinks.forEach(function(navLink) {
        navLink.addEventListener("click", function(evt){
            // scrolling behaviour
            smoothScrolling(evt);
        });
    })

    ///////////////////////////// SCROLLING VARIABLE /////////////////////////////////
    // Get the y position of every div and store it into an array
    var divsPosY = [];
    const divsTargeted = document.querySelectorAll("body section");

    divsTargeted.forEach((divTargeted) => {
        let roundedDivPosY = Math.floor(divTargeted.getBoundingClientRect().top + window.scrollY - navLinkTargetMargin);
        divsPosY.push(roundedDivPosY);
    })

    var divsNumber = divsPosY.length;

    // Contains information of current navigation links if user refresh page
    scrollingNavigation(navLinks, divsPosY, divsNumber);

    document.addEventListener("scroll", function() {
        // Changing selected navigations links color when section linked with navigation is viewed
        scrollingNavigation(navLinks, divsPosY, divsNumber);
    })

    ////////////////////////////////////////////////////////////////////////////////////

    // Changing navigation links section position when window is resized 
    window.addEventListener("resize", function() {

        clearTimeout(doneResizing);
        doneResizing = setTimeout(() => {
            divsPosY = [];
            divsTargeted.forEach((divTargeted) => {
                let roundedDivPosY = Math.floor(divTargeted.getBoundingClientRect().top + window.scrollY - navLinkTargetMargin);
                divsPosY.push(roundedDivPosY);
            })
            scrollingNavigation(navLinks, divsPosY, divsNumber);
        }, 500)

    })

})

// Changing selected navigations links color when section linked with navigation is viewed
function scrollingNavigation(navLinks, navLinksPosY, navNumber) {
    let currentPosY = window.scrollY;
    let removeClass = false;

    for(let counter = 0; counter < navNumber; counter++){
        if(counter < (navNumber - 1)) {
            if(currentPosY >= navLinksPosY[counter] && currentPosY < navLinksPosY[counter+1]){
                navLinks[counter].classList.add("selected");
            } else {
                removeClass = true;
            }
        } else if (counter == (navNumber - 1)) {
            if(currentPosY >= navLinksPosY[counter]){
                navLinks[counter].classList.add("selected");
            } else {
                removeClass = true;
            }
        }

        if (removeClass == true) {
            navLinks[counter].classList.remove("selected");
            removeClass = false;
        }
    }
}


// Function that enable page to scroll into selected navigation link section/div
// with animation behaviour of easeInSine.
function smoothScrolling(evt) {
    evt.preventDefault();

    /////////////////// Moving page into div according to navigation link ////////////////
    // Get nav href attr
    const navLinkReference = evt.target.getAttribute("href");

    // Get div with id value same as nav href
    const navLinkTarget = document.querySelector(navLinkReference);

    // Get position of targeted div relative to window
    var navLinkTargetPos = navLinkTarget.getBoundingClientRect();

    // Get position of targeted div relative to window add the total pixels of scrolling
    var navLinkTargetPosY = navLinkTargetPos.top + window.scrollY;
    var roundedPosY = Math.floor(navLinkTargetPosY);
    
    // Move the page into targeted div position with duration animation
    const pageHtml = document.scrollingElement;

    // Initial scrolling position and what position should page move to and how much the duration is
    let initialScrollPos = pageHtml.scrollTop;
    let changedScrollPos = roundedPosY - initialScrollPos - navLinkTargetMargin;
    let initialTime = 0;
    let incrementTime = 10;
    let endingTime = 600;

    // Animate scrolling behaviour using easeInSine function
    // Reference: https://gist.github.com/felipenmoura/650e7e1292c1e7638bcf6c9f9aeb9dd5
    var animateScrolling = function() {
        initialTime += incrementTime;
        let incrementPosChange = easeInSine(initialTime, initialScrollPos, changedScrollPos, endingTime);
        pageHtml.scrollTo({top: incrementPosChange});

        if (initialTime < endingTime) {
            setTimeout(animateScrolling, incrementTime);
        } 
    }

    animateScrolling();

    ////////////////////////////////////////////////////////////////////////////////////////
}

// EaseInSine easing function
function easeInSine (t, b, c, d) {
    /*
    t = Time. Amount of time that has passed since beginning of animation.
    Usually start from 0 to finish time.
    b = beginning value. Starting point of animation. start from 0.
    c = change in value. The amount of change needed to go from starting point to end point.
    d = duration. The amount of time the animation will take.
    Reference:
    https://spicyyoghurt.com/tools/easing-functions
    */
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}


