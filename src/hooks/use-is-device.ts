import { useEffect, useState } from "react";

export const useStrictMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(
				window.innerWidth < 768 ||
					/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
			);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return { isMobile };
};
