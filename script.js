document.addEventListener('DOMContentLoaded', function() {
    const tooltipContainers = document.querySelectorAll('.tooltip-container');
    const tooltip = document.getElementById('tooltip');
    let tooltipVisible = false;
    let currentTooltipContainer = null;
    let isTooltipFixed = false;

    tooltipContainers.forEach(container => {
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('mousemove', moveTooltip);
        container.addEventListener('click', toggleTooltip);
        container.addEventListener('touchend', toggleTooltip);
    });

    function handleMouseEnter(event) {
        if (!isTooltipFixed) {
            showTooltip(event);
        }
    }

    function handleMouseLeave(event) {
        if (!isTooltipFixed) {
            hideTooltip();
        }
    }

    function showTooltip(event) {
        const tooltipText = event.currentTarget.getAttribute('data-tooltip');
        tooltip.innerHTML = tooltipText;
        tooltip.style.opacity = 1;
        tooltip.style.zIndex = 1000;
        tooltipVisible = true;
        currentTooltipContainer = event.currentTarget;
        moveTooltip(event); // Move tooltip to the correct position on show
    }

    function hideTooltip() {
        tooltip.style.opacity = 0;
        tooltip.style.zIndex = -1;
        tooltipVisible = false;
        tooltip.style.left = '0';
        tooltip.style.top = '0';
        currentTooltipContainer = null;
    }

    function moveTooltip(event) {
        if (!tooltipVisible || isTooltipFixed) return;

        // Use event.changedTouches for touch events
        const mouseX = event.pageX || (event.changedTouches && event.changedTouches[0].pageX);
        const mouseY = event.pageY || (event.changedTouches && event.changedTouches[0].pageY);
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const containerRect = currentTooltipContainer.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;

        const offsetX = 15;
        const offsetY = 15;

        let tooltipX = mouseX + offsetX;
        let tooltipY = mouseY + offsetY;

        if (mouseX > containerCenterX) {
            // If mouse is on the right half of the element, show tooltip on the left
            tooltipX = mouseX - tooltipWidth - offsetX;
        }

        // Ensure tooltip stays within the viewport
        if (tooltipX + tooltipWidth > window.innerWidth) {
            tooltipX = window.innerWidth - tooltipWidth - offsetX;
        }

        if (tooltipY + tooltipHeight > window.innerHeight) {
            tooltipY = window.innerHeight - tooltipHeight - offsetY;
        }

        if (tooltipX < 0) {
            tooltipX = offsetX;
        }

        if (tooltipY < 0) {
            tooltipY = offsetY;
        }

        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
    }

    function toggleTooltip(event) {
        event.preventDefault(); // Prevent default touch behavior
        if (tooltipVisible && currentTooltipContainer === event.currentTarget && isTooltipFixed) {
            hideTooltip();
            isTooltipFixed = false;
            document.addEventListener('mousemove', moveTooltip); // Re-enable mousemove event
        } else {
            showTooltip(event);
            isTooltipFixed = true;
            document.removeEventListener('mousemove', moveTooltip); // Disable mousemove event
            event.stopPropagation(); // Prevent click event from propagating to the body
        }
    }

    // Close tooltip when clicking outside, but show new tooltip if clicking another container
    document.addEventListener('click', function(event) {
        if (tooltipVisible && isTooltipFixed && !event.target.closest('.tooltip-container')) {
            hideTooltip();
            isTooltipFixed = false;
            document.addEventListener('mousemove', moveTooltip); // Re-enable mousemove event
        } else if (event.target.closest('.tooltip-container') && event.target.closest('.tooltip-container') !== currentTooltipContainer) {
            hideTooltip();
            event.target.closest('.tooltip-container').click();
        }
    });
});
