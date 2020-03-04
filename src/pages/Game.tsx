import React, {useEffect, useState} from "react";
import {answersObservable, getCurrentQuest, getTeamObserver} from '../shared/service';
import './Game.css';

/*
* Основной экран который видят игроки на проекторе
* на данном этапе мы будем в коллекции ИГРА хранить 1 вопрос
* в нем будут необходимые данные и пустой массив команд
* когда команды будут кликать мы выводим на экран список со временем - профит
*
* */
function getLoader(): any {
    return <div>Загрузка...</div>;
}

function getTable(teams: any[]) {
    return teams ? teams.map((team: any, key: number) => <div
        key={ key }>{ team.name } - { team.score } баллов</div>) : <div>Команд нет =(</div>;
}

function getGame(quest: any, teams: any[], answers: any[]) {
    return quest.gameOver ? <div className="quest-gameOver">
        <h1>С праздником милые дамы!</h1>
        <h2>Результаты:</h2>
        { getTable(teams) }
    </div> : <div className="quest">
        { quest.showAnswer ? <div className="quest-answer">
            <div>Правильный ответ: { quest.rightAnswer }</div>
            <div>{ quest.answerImg ?
                <img src={ quest.answerImg } width="400px" alt="answer" style={ {marginTop: '12px'} }/> : <></> }</div>
        </div> : <></> }
        <div className="quest-game flex-column-center">
            <div className="quest-game-images">
                {
                    quest.images.map((elem: string, key: number) =>
                        <div className="quest-game-image" key={ key }><img src={ elem } alt={ 'Quest' }/></div>
                    )
                }
            </div>
        </div>
        <div className='quest-answers flex-column-center'>
            <h2>Порядок ответов:</h2>
            { answers?.map((el: any, key: number) => <div
                key={ key }>{ el.name + ' ' + el.time }</div>) }
        </div>
        <div className="quest-score flex-column-center">
            <h2>Результаты:</h2>
            { getTable(teams) }
        </div>
    </div>
}

export function Game() {
    const [quest, setQuest] = useState<any>(null);
    const [teams, setTeams] = useState<any>(null);
    const [answers, setAnswers] = useState<any>(null);

    useEffect(() => {
        const sub = getCurrentQuest().subscribe((res) => {
            setQuest(res);
        });
        const teamSub = getTeamObserver().subscribe((teams) => {
            setTeams(teams.sort((el: any, next: any) => next.score - el.score))
        });
        const answersSub = answersObservable().subscribe((answers) => {
            setAnswers(answers);
        });
        return () => {
            sub.unsubscribe();
            teamSub.unsubscribe();
            answersSub.unsubscribe();
        }
    }, []);

    return <div>
        { quest ? getGame(quest, teams, answers) : getLoader() }
    </div>;
}
