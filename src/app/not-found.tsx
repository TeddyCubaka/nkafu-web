import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-10">
      <h1 className="text-3xl">404 | page non trouvé</h1>
      <Link href="/" className="text-primary">
        retour
      </Link>
    </div>
  );
};

export default Custom404;
