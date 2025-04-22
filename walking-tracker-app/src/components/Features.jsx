import React from "react";

const FeatureData = [
    { 
      id: 1,
      title: "Daily Step Goals",
      description: "Set and achieve custom daily step targets to stay on track with your fitness journey.",
      icon: "👟",
      delay: 0.3,
    },
    {
      id: 2,
      title: "Historical Data",
      description: "View and analyze your walking activity over weeks, months",
      icon: "🔥",
      delay: 0.5,
    },
    {
      id: 3,
      title: "Friendly Reminders",
      description: "Get motivated with reminders to keep moving throughout the day.",
      icon: "🎯",
      delay: 0.7,
    },
    {
      id: 4,
      title: "Track Calorie Burn",
      description: "Monitor the calories burned during your walks to stay on top of your fitness goals.",
      icon: "🏆",
      delay: 0.9,
    },
];

const Features = () => {
    return (
        <div>
            <div className="container py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-4 p-6">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Feature Available
                        </h1>
                        <p className="text-gray-500">
                            Quickly and accurately update your health data anytime, anywhere.
                        </p>
                    </div>
                    {FeatureData.map((item) => {
                        return(
                            <div key={item.id} className="space-y-4 p-6 bg-[#fbfbfb] hover:bg-white rounded-xl hover:shadow-[0_0_22px_0_rgba(0,0,0,0.15)]">
                                <div>{item.icon}</div>
                                <p className="text-2xl font-semibold">{item.title}</p>
                                <p className="text-gray-500">{item.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Features;
