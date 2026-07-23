export default function Footer() {
    return (
        <footer className="border-t border-gray-800 px-8 py-12 mt-20">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Glofi</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The first fully on-chain proprietary trading firm.
                        No trust required.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Platform</h4>
                    <ul className="flex flex-col gap-2">
                        <li><a href="/trader" className="text-gray-400 text-sm hover:text-white transition">Traders</a></li>
                        <li><a href="/investor" className="text-gray-400 text-sm hover:text-white transition">Investors</a></li>
                        <li><a href="/governance" className="text-gray-400 text-sm hover:text-white transition">Governance</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Resources</h4>
                    <ul className="flex flex-col gap-2">
                        <li><a href="/about" className="text-gray-400 text-sm hover:text-white transition">About Glofi</a></li>
                        <li><a href="#" className="text-gray-400 text-sm hover:text-white transition">Whitepaper</a></li>
                        <li><a href="#" className="text-gray-400 text-sm hover:text-white transition">Documentation</a></li>
                        <li><a href="/contracts-info" className="text-gray-400 text-sm hover:text-white transition">Smart Contracts</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Community</h4>
                    <ul className="flex flex-col gap-2">
                        <li><a href="#" className="text-gray-400 text-sm hover:text-white transition">Twitter</a></li>
                        <li><a href="#" className="text-gray-400 text-sm hover:text-white transition">Discord</a></li>
                        <li><a href="#" className="text-gray-400 text-sm hover:text-white transition">Telegram</a></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-4xl mx-auto border-t border-gray-800 mt-12 pt-8 flex justify-between items-center">
                <p className="text-gray-400 text-sm">© 2026 Glofi. All rights reserved.</p>
                <p className="text-gray-400 text-sm">Built on Polygon</p>
            </div>

        </footer>
    )
}