import React, { useEffect, useState } from "react";
import { Box, Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import NavBar from "../components/NavBar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stats = () => {
  const [upvotesData, setUpvotesData] = useState(null);
  const [commentsData, setCommentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topStoriesResponse = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const topStories = await topStoriesResponse.json();
        const storyDetailsPromises = topStories.slice(0, 10).map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) => response.json())
        );
        const stories = await Promise.all(storyDetailsPromises);

        const upvotes = stories.map((story) => story.score);
        const comments = stories.map((story) => story.descendants);
        const titles = stories.map((story) => story.title);

        setUpvotesData({
          labels: titles,
          datasets: [
            {
              label: "Upvotes",
              data: upvotes,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        setCommentsData({
          labels: titles,
          datasets: [
            {
              label: "Comments",
              data: comments,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent>
        <Text fontSize="xl" color="red.500">
          Error fetching data
        </Text>
      </Container>
    );
  }

  return (
    <Box>
      <NavBar />
      <Container maxW="container.xl" p={4}>
        <VStack spacing={8}>
          <Box w="100%">
            <Heading as="h2" size="lg" mb={4}>
              Upvotes per Story
            </Heading>
            <Bar data={upvotesData} options={{ responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Upvotes per Story" } } }} />
          </Box>
          <Box w="100%">
            <Heading as="h2" size="lg" mb={4}>
              Comments per Story
            </Heading>
            <Bar data={commentsData} options={{ responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Comments per Story" } } }} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Stats;