export const getSecureImageUrl = (url: string | null) => {
    if (!url) return '';
    
    let targetUrl = url;
    if (!url.startsWith('http')) {
        targetUrl = `http://aounn.runasp.net/uploads/${url.replace(/^\/?(uploads\/)?/, '')}`;
    }
    
    return `/_next/image?url=${encodeURIComponent(targetUrl)}&w=1080&q=75`;
};
