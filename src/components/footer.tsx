import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-white/50">
                <p>
                    &copy; {new Date().getFullYear()} Artikel Bahasa Indonesia. All rights reserved.
                </p>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <p className="flex items-center gap-1.5">
                        Created by 
                        <Link 
                            href="https://github.com/hylmithecoder" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white font-medium hover:underline transition-colors"
                        >
                            hylmithecoder
                        </Link>
                        {" "}and TRPL 2C
                    </p>
                </div>
            </div>
        </footer>
    );
}
