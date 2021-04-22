declare var jQuery: any;

export function correctHeight(): void {

  const pageWrapper = jQuery('#page-wrapper');
  const navbarHeight = jQuery('nav.navbar-default').height();
  const wrapperHeigh = pageWrapper.height();

  if (navbarHeight > wrapperHeigh) {
    pageWrapper.css('min-height', navbarHeight + 'px');
  }

  if (navbarHeight < wrapperHeigh) {
    if (navbarHeight < jQuery(window).height()) {
      pageWrapper.css('min-height', jQuery(window).height() + 'px');
    } else {
      pageWrapper.css('min-height', navbarHeight + 'px');
    }
  }

  if (jQuery('body').hasClass('fixed-nav')) {
    if (navbarHeight > wrapperHeigh) {
      pageWrapper.css('min-height', navbarHeight + 'px');
    } else {
      pageWrapper.css('min-height', jQuery(window).height() - 60 + 'px');
    }
  }
}

export function detectBody(): void {
  if (jQuery(document).width() < 769) {
    jQuery('body').addClass('body-small');
  } else {
    jQuery('body').removeClass('body-small');
  }
}

export function smoothlyMenu(): void {
  if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
    // Hide menu in order to smoothly turn on when maximize menu
    jQuery('#side-menu').hide();
    // For smoothly turn on menu
    setTimeout(
      () => {
        jQuery('#side-menu').fadeIn(400);
      }, 200);
  } else if (jQuery('body').hasClass('fixed-sidebar')) {
    jQuery('#side-menu').hide();
    setTimeout(
      () => {
        jQuery('#side-menu').fadeIn(400);
      }, 100);
  } else {
    // Remove all inline style from jquery fadeIn function to reset menu state
    jQuery('#side-menu').removeAttr('style');
  }
}
