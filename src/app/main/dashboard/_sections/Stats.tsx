import Link from "next/link";
import React from "react";

export default function Stats({ userHealthProfile }) {
  console.log(userHealthProfile);
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <OneStatInfo
        nameKey="Weight"
        content={
          userHealthProfile?.weightPounds
            ? userHealthProfile.weight + " lbs"
            : userHealthProfile?.weight + " kg"
        }
      />
      <OneStatInfo
        nameKey="Height"
        content={
          userHealthProfile?.heightInches
            ? userHealthProfile.height + " in"
            : userHealthProfile?.height + " cm"
        }
      />
      <OneStatInfo nameKey="Age" content={userHealthProfile?.age} />
      <OneStatInfo
        nameKey="BMI"
        content={(
          (userHealthProfile?.weightPounds
            ? userHealthProfile.weight * 2.20462
            : userHealthProfile.weight) /
          (userHealthProfile?.heightInches
            ? userHealthProfile.height * 0.0254
            : userHealthProfile.height * 0.01)
        ).toFixed(2)}
      />
    </div>
  );
}

function OneStatInfo({ nameKey, content }) {
  return (
    <Link
      href="/main/user-health-update"
      className="rounded flex gap-2 w-full justify-center items-center bg-main-background-100 p-4"
    >
      <p className="text-main-text-100">{nameKey}:</p>
      <p className="text-main-text-100">{content}</p>
    </Link>
  );
}
