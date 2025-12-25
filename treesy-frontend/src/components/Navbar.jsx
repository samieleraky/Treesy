export default function Navbar() {
    return (
        <nav className="bg-white shadow-md py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
                <h1 className="text-2xl font-bold text-green-700">Treesy</h1>
                <div className="space-x-6 text-gray-700">
                    <a href="#plans" className="hover:text-green-700">Abonnementer</a>
                    <a href="#impact" className="hover:text-green-700">Impact</a>
                    <a href="#how" className="hover:text-green-700">Sådan virker det</a>
                </div>
            </div>
        </nav>
    );
}
