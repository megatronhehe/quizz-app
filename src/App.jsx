import React, { useState, useEffect } from "react";

function App() {
	const [allQuizData, setAllQuizData] = useState([]);

	const [userAnswersData, setUserAnswersData] = useState([]);

	const [startQuiz, setStartQuiz] = useState(false);
	const [loading, setLoading] = useState(false);

	const quizDataCorrectAnswer = allQuizData.map((quiz) => ({
		id: quiz.id,
		correct_answer: quiz.correct_answer,
	}));

	const getAPI = () => {
		setLoading(true);
		fetch(
			"https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple"
		)
			.then((res) => res.json())
			.then((data, i) => {
				setAllQuizData(
					data.results.map((item, i) => ({
						...item,
						id: i,
						all_answers: [...item.incorrect_answers, item.correct_answer],
					}))
				);
				setLoading(false);
			});
	};

	console.log(userAnswersData);

	const pickAnswer = (quizId, answer) => {
		const thisQuiz = allQuizData.find((quiz) => quiz.id === quizId);

		const thisQuizModified = { id: thisQuiz.id, answer: answer };

		setUserAnswersData((prev) => {
			const isExist = prev.some((item) => item.id === quizId);
			if (isExist) {
				return prev.map((item) =>
					item.id === quizId ? { ...item, answer: answer } : item
				);
			} else {
				return [...prev, thisQuizModified];
			}
		});
	};

	const quizzesElement = allQuizData.map((quiz, i) => {
		const quizAnswersElement = quiz.all_answers.map((answer, i) => {
			const selectedElement = userAnswersData.some(
				(item) => item.answer === answer
			);

			return (
				<li
					className={`p-3 flex justfy-center border border-blue-400 rounded-xl ${
						selectedElement ? "bg-blue-400 text-white border-white" : ""
					}`}
					onClick={() => pickAnswer(quiz.id, answer)}
					key={i}
				>
					{answer}
				</li>
			);
		});

		return (
			<div
				key={quiz.id}
				className="relative mt-14 border p-4 rounded-xl shadow-sm"
			>
				<h1 className="text-gray-500 mb-6 font-semibold border-b py-4">
					{quiz.question}
				</h1>

				<ul className="text-blue-500 text-xs flex justify-between items-center">
					{quizAnswersElement}
				</ul>
				<p className="absolute w-12 h-12 text-blue-500 bg-white  border-2 border-blue-400 -top-7 rounded-xl flex items-center justify-center font-semibold">
					{i + 1}
				</p>
			</div>
		);
	});

	return (
		<>
			<h1 className="text-center py-4 bg-blue-400 text-xl text-white tracking-widest">
				Quiz.<span className="text-blue-700 font-semibold">ez</span>
			</h1>
			{startQuiz ? (
				loading ? (
					<div className="text-center mt-32 text-gray-400">
						<p>loading. . .</p>
					</div>
				) : (
					<div>
						<div className="p-8">{quizzesElement}</div>
						<div className="text-center py-8">
							<button className="font-semibold bg-lime-400 shadow-md p-4 rounded-xl text-white">
								Submit
							</button>
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
					<h1 className="text-blue-400 font-semibold tracking-widest text-xl mb-4">
						Quiz.ez
					</h1>
					<p className="mb-12 text-gray-500">
						Test your general knowledge by answering little quizzes yes?
					</p>
					<button className="bg-lime-400 p-4 m text-white font-semibold rounded-xl show-sm">
						start quiz!
					</button>
				</div>
			)}
		</>
	);
}

export default App;
