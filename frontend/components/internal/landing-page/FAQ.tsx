import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type FAQInfo = {
    question: string;
    answer: string;
}

const mockFaqs: FAQInfo[] = [
    {
        question: "How quickly can I start earning returns?",
        answer: "Immediately after investing. Your 10% monthly return begins from the moment your funds are deposited.",
    }, {
        question: "Are there any hidden fees?",
        answer: "Zero commission. Every shilling you invest directly contributes to your returns.",
    }, {
        question: "Is my investment secure?",
        answer: "We use sophisticated risk management algorithms and are regulated by Kenyan financial authorities like CMA and CBK.",
    },  {
        question: "How are returns calculated?",
        answer: "10% flat monthly rate, calculated on your total invested amount. Simple, predictable, transparent.",
    },{
        question: "What's the minimum investment?",
        answer: "The minimum investment is $100",
    },{
        question: "What's the maximum investment?",
        answer: "You can invest however much you can. However, for investments more than $50,000, you have to contact us first.",
    },
]

export default function FAQ({faqs}:{faqs?: FAQInfo[]}) {
    if (faqs === undefined) {
        faqs = mockFaqs
    }

    const [expanded, setExpanded] = React.useState<string[]>([]);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(
                isExpanded
                    ? [...expanded, panel]
                    : expanded.filter((item) => item !== panel),
            );
        };

    return (
        <Container
            id="faq"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Typography
                component="h2"
                variant="h4"
                sx={{
                    color: 'text.primary',
                    width: { sm: '100%', md: '60%' },
                    textAlign: { sm: 'left', md: 'center' },
                }}
            >
                Frequently asked questions
            </Typography>
            <Box sx={{ width: '100%' }}>
                {faqs.map((faq, index) => {
                    const id = `panel${index}`;
                    const idContent = `${id}-content`;
                    const idHeader = `${id}-header`;
                    return (
                        <Accordion
                            expanded={expanded.includes(id)}
                            onChange={handleChange(id)}
                            key={id}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={idContent}
                                id={idHeader}
                            >
                                <Typography component="h3" variant="subtitle2">
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    sx={{ maxWidth: { sm: '100%', md: '70%' } }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </Box>

        </Container>
    );
}
