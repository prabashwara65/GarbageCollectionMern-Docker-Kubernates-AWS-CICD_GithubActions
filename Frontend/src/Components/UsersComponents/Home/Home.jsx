// Home.js
import heroGridsImage from "./Grid.svg";
import Button from "./Button";
import NavigationBar from "./NavigationBar";

export default function Home() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-green-400 via-green-500 to-green-300 relative overflow-x-hidden">
      <img
        src={heroGridsImage}
        className="absolute object-cover w-full h-full z-0 opacity-[25%]"
      />
      <div className="w-full h-full bg-gradient-to-b md:bg-gradient-to-b from-[#00000000] via-[#00000000] via-[40%] to-[#000000] absolute"></div>
      <NavigationBar className={"z-[1] text-white"} />
      <section className="h-[calc(100svh)] min-h-[400px] md:h-[calc(100vh-68px)] md:min-h-[500px] md:max-h-[900px] px-2 text-white text-center flex flex-col justify-center z-[1]">
        <div className="container flex flex-col items-center mx-auto z-[1] text-center -mt-[105px]">
          <h1 className="text-[48px] leading-[52px] max-w-[340px] sm:max-w-none md:leading-normal md:text-[48px] font-bold dm-sans-600 mb-4 md:mb-2 drop-shadow-white-glow">
            Garbage Collection
          </h1>
          <p className="text-[24px] leading-[30px] md:leading-normal md:text-[28px] font-normal dm-sans-400 max-w-[500px] sm:max-w-[600px] md:max-w-[768px]">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi
            inventore, facilis neque iusto provident ab nisi consequatur atque
            pariatur autem aperiam beatae rem eveniet a. Iure magnam nam
            distinctio similique?
          </p>
          <div className="inline-flex gap-x-4 mt-6">
            <Button
              text="Explore"
              link="#"
              color="white"
              className={"drop-shadow-white-glow"}
            />
            <Button
              text="Register Now"
              link="#"
              color="orange"
              className={"drop-shadow-orange-glow"}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
