import React from "react";
import HeroImg from "../assets/HeroImg.png";

const Hero = () => {
  return ( 
   <>
     <section>
       <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
         {/* Brand info */}
         <div className="flex flex-col justify-center py-14 md:py-0">
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-relaxed xl:leading-normal">
                WalkMate Track your Progress{" "}
                <span className="text-primary">Easily</span>
              </h1>
              <p className="text-white-600 xl:max-w-[500px] leading-relaxed">
                The point of using WalkMate is to improve your overall health by tracking your walking habits, staying motivated, and achieving your fitness goals.
              </p>
              <div className="flex justify-center items-center gap-8 md:justify-start !mt-4">
                <button className="primary-btn flex items-center gap-2">
                   {" "}
                   Track Now
                </button>
              </div>
            </div>
         </div>
         <div className="flex justify-center items-center">
          {/*<img 
            src={HeroImg} 
            alt="Hero" 
            className="w-[350px] md:w-[550px] xl:w-[500px] max-w-full"
          /> */}
         </div>
       </div>
     </section>
   </>
  );
};

export default Hero;
