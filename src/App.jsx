import React, { useState, useEffect } from "react";

import { RxCross2, RxCheck } from "react-icons/rx";

function App() {
	const [allQuizData, setAllQuizData] = useState([]);
	const [userAnswersData, setUserAnswersData] = useState([]);

	const [startQuiz, setStartQuiz] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [loading, setLoading] = useState(false);

	const quizDataCorrectAnswer = allQuizData.map((quiz) => ({
		id: quiz.id,
		correct_answer: quiz.correct_answer,
	}));

	const shuffleArray = (array) => {
		return array
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	};

	const getAPI = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				"https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple"
			);
			if (!response.ok) {
				throw new Error("Failed to fetch API");
			}
			const data = await response.json();
			setAllQuizData(
				data.results.map((item, i) => ({
					...item,
					id: i,
					all_answers: shuffleArray([
						...item.incorrect_answers,
						item.correct_answer,
					]),
				}))
			);
			setUserAnswersData(
				data.results.map((item, i) => ({
					id: i,
					answer: "",
				}))
			);
		} catch (error) {
			console.error("Error fetching API:", error);
		} finally {
			setLoading(false);
		}
	};

	const pickAnswer = (quizId, answer) => {
		setUserAnswersData((prev) => {
			return prev.map((item) =>
				item.id === quizId ? { ...item, answer: answer } : item
			);
		});
	};

	const startOver = () => {
		setStartQuiz(false);
		setShowResult(false);
		setAllQuizData([]);
		setUserAnswersData([]);
	};

	const compareAnswer = () => {
		const correctAnswerArray = quizDataCorrectAnswer.map(
			(item) => item.correct_answer
		);
		const userAnswer = userAnswersData.map((item) => item.answer);
		const countScore = correctAnswerArray.reduce(
			(a, c) => a + userAnswer.includes(c),
			0
		);
		return countScore;
	};

	const quizzesElement = allQuizData.map((quiz, i) => {
		const thisQuizCorrectAnswer = quizDataCorrectAnswer.find(
			(item) => item.id === quiz.id
		);
		let isUserCorrect;
		const quizAnswersElement = quiz.all_answers.map((answer, i) => {
			const isSelected = userAnswersData.some((item) => item.answer === answer);

			const correctAnswer = thisQuizCorrectAnswer.correct_answer === answer;

			isUserCorrect = userAnswersData.some(
				(item) => item.answer === thisQuizCorrectAnswer.correct_answer
			);

			return (
				<button
					className={`p-3 flex justfy-center border border-blue-400 rounded-xl 
						${isSelected ? "bg-blue-400 text-white border-white" : ""}
						${showResult && correctAnswer ? "bg-green-400 border-white text-white" : ""}`}
					disabled={showResult}
					onClick={() => pickAnswer(quiz.id, answer)}
					key={i}
				>
					{answer}
				</button>
			);
		});

		return (
			<div
				key={quiz.id}
				className="relative p-4 border shadow-sm mt-14 rounded-xl"
			>
				<h1 className="py-4 mb-6 font-semibold text-gray-500 border-b">
					{quiz.question}
				</h1>

				<ul className="flex items-center justify-between text-xs text-blue-500">
					{quizAnswersElement}
				</ul>
				<div className="absolute flex items-center gap-4 -top-6">
					<p className="flex items-center justify-center w-12 h-12 font-semibold text-blue-500 bg-white border-2 border-blue-400 rounded-xl">
						{i + 1}
					</p>
					<p>
						{showResult ? (
							isUserCorrect ? (
								<RxCheck color="lime" size="30" />
							) : (
								<RxCross2 color="red" size="30" />
							)
						) : (
							""
						)}
					</p>
				</div>
			</div>
		);
	});

	return (
		<>
			<h1 className="py-4 text-xl tracking-widest text-center text-white bg-blue-400">
				Quiz.<span className="font-semibold text-blue-700">ez</span>
			</h1>
			{startQuiz ? (
				loading ? (
					<div className="mt-32 text-center text-gray-400">
						<p>loading. . .</p>
					</div>
				) : (
					<div className="flex justify-center text-center">
						<div className="w-full max-w-4xl">
							<div className="p-8">{quizzesElement}</div>
							<div className="flex justify-between py-8 text-center px-14">
								<p>
									{showResult &&
										`your score is ${compareAnswer()} / ${allQuizData.length}`}
								</p>
								<button
									onClick={showResult ? startOver : () => setShowResult(true)}
									className={`w-1/3 p-4 font-semibold text-white bg-green-400 shadow-md rounded-xl ${
										showResult ? "bg-blue-500" : ""
									}`}
								>
									{showResult ? "Back to Menu" : "Submit"}
								</button>
							</div>
						</div>
					</div>
				)
			) : (
				<div
					className="text-center mt-36"
					onClick={() => {
						setStartQuiz(true);
						getAPI();
					}}
				>
					<h1 className="mb-4 text-xl font-semibold tracking-widest text-blue-400">
						Quiz.ez
					</h1>
					<p className="mb-12 text-gray-500">
						Test your general knowledge by answering little quizzes yes?
					</p>
					<button className="p-4 font-semibold text-white bg-green-400 m rounded-xl show-sm">
						start quiz!
					</button>
				</div>
			)}
		</>
	);
}

export default App;
