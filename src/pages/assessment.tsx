import { useRouter } from "next/router";
import AssessmentComp from "../views/assessmentComp";

export default function Home() {
  const router = useRouter();

  return (
  <div className="flex flex-col px-5 bg-[#006400] justify-center items-center">
      <AssessmentComp
        cid={parseInt((router.query.courseID as string), 0)}
        bounty={parseInt((router.query.courseBounty as string), 0)}
      />
  </div>
  );
}
