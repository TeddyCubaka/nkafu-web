import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react"; // Icône pour image non chargée

const ImageWithFallback = ({
  src,
  alt,
  width = 100,
  height = 100,
  className = "",
}: {
  src: string;
  alt: string;
  className: string;
  width: number;
  height: number;
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`${className}`}>
      {error ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
          <ImageOff className="w-6 h-6 text-gray-400" />
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={`rounded-md ${isLoading ? "opacity-0" : "opacity-100"}`}
            onError={() => setError(true)}
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </div>
  );
};

export default ImageWithFallback;

// Utilisation dans votre composant
{
  /* <ImageWithFallback
  src={
    String(item[column.property as keyof typeof item]) &&
    isValidUrlRegex(String(item[column.property as keyof typeof item]))
      ? String(item[column.property as keyof typeof item])
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${
          item[column.property as keyof typeof item]
        }`
  }
  alt="url image"
  className="border-2 border-green-500 h-16 w-16"
/>; */
}
