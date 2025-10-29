export const getTopics = (data: string): string[] => {
	const topics = data
		.split(",")
		.map((topic) => topic.trim())
		.filter((topic) => topic.length > 0);

	if (topics.includes("*")) {
		return ["*"];
	}

	return topics;
};
