import Link from "next/link"

export default async function UserDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 max-w-2xl mx-auto">
                <div className="text-6xl mb-6 opacity-80">✍️</div>
                <h2 className="text-3xl text-white font-bold mb-4">Welcome to Your Dashboard!</h2>
                <p className="text-white/70 mb-8 max-w-md mx-auto">
                    Here you can write complete articles with rich HTML and attach multiple media files or videos to make them stand out.
                </p>
                <Link 
                    href="/dashboard/create" 
                    className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 text-lg rounded-xl shadow-lg border border-blue-400 transition-all"
                >
                    + Create New Article
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <div className="text-4xl mb-3">📄</div>
                    <h3 className="font-semibold text-white">Rich HTML Content</h3>
                    <p className="text-sm text-white/60 mt-2">Format your articles with HTML tags directly.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <div className="text-4xl mb-3">🎥</div>
                    <h3 className="font-semibold text-white">Video & Iframe</h3>
                    <p className="text-sm text-white/60 mt-2">Embed videos and media effortlessly in any section.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <h3 className="font-semibold text-white">Documentation Hub</h3>
                    <p className="text-sm text-white/60 mt-2">Attach multiple gallery images to the footer.</p>
                </div>
            </div>
        </div>
    )
}
