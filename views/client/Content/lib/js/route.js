if (window.location.pathname.startsWith('/products/') && !window.location.pathname.endsWith('.html')) {
    var productName = window.location.pathname.split('/').pop();
    window.location.href = `/products/?${productName}`;
}