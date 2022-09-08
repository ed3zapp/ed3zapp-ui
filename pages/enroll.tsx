import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import Button from "../components/button";

const Enroll: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleLearnerOnboard = async (name) => {

    //TODO contract init and invocation of create learner()
    console.log("Learner Onboard process started, name: ",name);
    router.push("/learner");
  };
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-hero text-blue-dark text-center mb-[8vh]">
        Join Ed3Zapp now <br />
      </h1>
      <div className="flex px-12 pb-12 justify-between items-end">
        <div className="flex-1 mr-12">
          <InputGroup className="flex flex-col">
            <Form.Label htmlFor="name">Learner name</Form.Label>
            <FormControl
              placeholder="Enter the learner name"
              aria-label="name"
              style={{ width: "100%", borderRadius: 12 }}
              onChange={(value) => setName(value.currentTarget.value)}
            />
          </InputGroup>
        </div>
        <div>
          <Button
            onClick={() => handleLearnerOnboard(name)}
          >
            <div className="flex items-center">
              <span className="mr-6">Signup</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
