import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import getConfig from 'next/config'
import { useStore } from "../services/store";
import { createFlow, updateFlow } from "../services/hooks/useSFsdk";
import { retrieveFile } from "../services/web3StorageUtils";
import { mintNFT } from "../services/nftHelper";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Trophy from 'mdi-material-ui/Trophy'
import TrophyBroken from 'mdi-material-ui/TrophyBroken'
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";


export interface IAssessment {
  cid: number;
  bounty: number;
}

// Styled component for the trophy image
const TrophyImg = styled('img')({
    right: 36,
    bottom: 20,
    height: 98,
    position: 'absolute'
  })

const AssessmentComp: React.FC<IAssessment> = ({
  cid, 
  bounty
}) => {
    // ** Hook
    const theme = useTheme()
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [scorePercentage, setScorePercentage] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState(false);
    const router = useRouter();
    const { publicRuntimeConfig } = getConfig()
    const [questions, setQuestions] = useState([]);
    const { state: { contract, wallet}, } = useStore();
    const imageUrl = "https://i.ibb.co/Dwjyg7R/Bountyz-Cert.jpg";
    const [nftURL, setNftURL] = useState("");
    

    useEffect(() => {
        if (!contract) {
          return;
        }
        loadQuestions();
      }, [contract]);

      
    const loadQuestions = async () => {
        try {
            console.log("in load questions")
            const courseIpfsURL = await contract.fetchAssessmentQuestions(cid);
            console.log("course URL: " + courseIpfsURL)
            const result = await retrieveFile(courseIpfsURL);
            setQuestions(result)
        } catch (error) {
            console.log("Error loading questions: " + error)
      }
    }

    const handleAnswerOption = (answer, index) => {
        setSelectedOptions([
        (selectedOptions[index] = { answerByUser: answer }),
        ]);
        setSelectedOptions([...selectedOptions]);
        console.log(selectedOptions);
    };

    const handleSubmitButton = async() => {
        let newScore = 0;
        for (let i = 0; i < questions.length; i++) {
        questions[i].answerOptions.map(
            (answer) =>
            answer.isCorrect &&
            answer.answer === selectedOptions[i]?.answerByUser &&
            (newScore += 1)
        );
        }
        setScore(newScore);
        setShowScore(true);

        // Calculate percentage
        let scorePercentageVal = ( newScore / questions.length ) * 100;
        console.log("questions.length: " + questions.length)
        setScorePercentage(scorePercentageVal);
        console.log("scorePercentageVal: " + scorePercentageVal)
        // Evaluate assessment result
        if (scorePercentageVal >= publicRuntimeConfig.AssessmentPassPercentage) {
        setAssessmentResult(true);
        const url = await mintNFT(wallet, "KalviMilestoneNFT", "Kalvi course completion NFT", imageUrl);
        setNftURL(url)
        console.log("NFT URL: " + url)
        }
    };

    // Called when assessment is cleared
    const assessmentPassed = async (_cid: number, _bounty: number) => {
        const totalBountyValue = await contract.getTotalCourseBountyValue(wallet);
        if(totalBountyValue > 0) {
        let bountyValue = totalBountyValue + _bounty;
        console.log("update flow if cond: " + bountyValue);
        updateFlow(wallet, bountyValue);
        } else {
        console.log("create flow if cond: " + _bounty)
        createFlow(wallet, _bounty);
        }
        await contract.completeCourse(_cid);
        router.push("/learnerDashboard");
    }

    // Called when assessment is not cleared
    const assessmentFailed = async () => {
        router.push("/learnerCourses");
    }

    const { width, height } = useWindowSize();
    const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'
    
    return (
        <ApexChartWrapper>
            <Grid container spacing={6}>
                <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                    <Typography variant='h5'>Assessment</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: 5 }}>
                    <Divider
                        textAlign='left'
                        sx={{
                        m: 0,
                        width: '100%',
                        lineHeight: 'normal',
                        textTransform: 'uppercase',
                        '&:before, &:after': { top: 7, transform: 'none' },
                        '& .MuiDivider-wrapper': { px: 2.5, fontSize: '0.75rem', letterSpacing: '0.21px' }
                        }}
                        />
                </Grid>
            {showScore ? (
                <>
                <Grid item xs={12} md={12} sx={{ paddingTop: 10 }}>
                    <Card>
                        <CardContent
                            sx={{
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
                            }}
                        >
                            <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
                            {assessmentResult ? (<><Trophy sx={{ fontSize: '4rem' }} /> <Confetti width={width} height={height} /> <br/> 
                                Congrats! You have successfully cleared this assessment!</>)
                            : (<><TrophyBroken sx={{ fontSize: '4rem' }} /> <br/> 
                                Sorry! You have not scored enough to clear this assessment.</>)}
                            </Typography>
                            <Typography variant='body2' sx={{ marginBottom: 6 }}>
                                You scored {score} out of {questions.length}
                            </Typography>
                            <Button variant='contained' sx={{ padding: theme => theme.spacing(1.75, 5.5) }} 
                            onClick={() => (assessmentResult ? assessmentPassed(cid, bounty) : assessmentFailed())}>
                                {assessmentResult ? "Mint NFT" : "Retry"}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                </>
            ) : (
                <>
                {questions.map((item, questionsIndex) => (
                    <Grid item xs={12} md={12}>
                    <Card>
                        <CardHeader title={(questionsIndex + 1) + ". " + item.question} titleTypographyProps={{ variant: 'h6' }} />
                        <CardContent>
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                <FormControl>
                                    <RadioGroup aria-label='assessment' name='account-settings-info-radio'>
                                        {item.answerOptions.map((answer) => (
                                            <FormControlLabel value={answer.answer} label={answer.answer} control={<Radio />} checked={
                                                answer.answer ===
                                                selectedOptions[questionsIndex]?.answerByUser
                                            }
                                            onChange={(e) => handleAnswerOption(answer.answer, questionsIndex)}/>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                ))}
                <Grid item xs={12} md={12} sx={{ paddingTop: 10, paddingBottom: 10, textAlign:'center' }}>
                    <Button variant='contained' sx={{ padding: theme => theme.spacing(1.75, 5.5) }} onClick={ handleSubmitButton }>
                        Submit
                    </Button>
                </Grid>
                </>
            )}
            </Grid>
        </ApexChartWrapper>
      );
};

export default AssessmentComp;
