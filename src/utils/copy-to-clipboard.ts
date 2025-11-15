export const copyToClipboard = async (text: string, message = "copied") => {
	try {
		await navigator.clipboard.writeText(text);
	} catch {}
};
