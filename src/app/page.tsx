import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Yoga Teacher Ratings</h1>
        <p className="text-lg text-gray-600">
          Rate your yoga teachers and keep track of your favorites
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/teachers"
            className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <Image 
              src="/globe.svg" 
              alt="View teachers icon" 
              width={64} 
              height={64}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">View Teachers</h2>
            <p className="text-gray-600">Browse and search for yoga teachers</p>
          </Link>
          
          <Link
            href="/add-rating"
            className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <Image 
              src="/file.svg" 
              alt="Rate teacher icon" 
              width={64} 
              height={64}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">Rate a Teacher</h2>
            <p className="text-gray-600">Add a new rating for a yoga teacher</p>
          </Link>
          
          <Link
            href="/my-ratings"
            className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <Image 
              src="/window.svg" 
              alt="My ratings icon" 
              width={64} 
              height={64}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">My Ratings</h2>
            <p className="text-gray-600">View your rating history</p>
          </Link>
          
          <Link
            href="/favorites"
            className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <Image 
              src="/vercel.svg" 
              alt="Favorites icon" 
              width={64} 
              height={64}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">Favorites</h2>
            <p className="text-gray-600">View your favorite teachers</p>
          </Link>
        </div>
      </main>
    </div>
  );
}