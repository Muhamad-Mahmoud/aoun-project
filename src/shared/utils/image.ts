export const getSecureImageUrl = (url: string | null) => {
    if (!url) return '';
    if (url.startsWith('http')) return url.replace(/^http:/i, 'https:');
    return `http://aounn.runasp.net/uploads/${url.replace(/^\/?(uploads\/)?/, '')}`;
};
