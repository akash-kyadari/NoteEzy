export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6">
      <div className="container mx-auto p-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} NoteZy. All rights reserved.</p>
      </div>
    </footer>
  );
}