import CareerCard from "@/components/common/CareerCard";

const Page = () => {
  const careers = ["ET", "FT", "AE", "CF", "DS"];

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <p className="text-center">Encuesta</p>
        <p className="font-bold text-6xl">
          Opiniones sobre la{" "}
          <strong className="font-bold bg-purple-200 text-purple-600 rounded-xl px-2">
            Idea
          </strong>{" "}
          de la{" "}
          <strong className="font-bold bg-purple-200 text-purple-600 rounded-xl px-2">
            Plataforma
          </strong>{" "}
          de Empleo
        </p>
      </div>

      <section className="flex gap-4">
        {careers.map((career, index) => (
          <CareerCard key={index} career={career} />
        ))}
      </section>
    </div>
  );
};

export default Page;
