import React, {useEffect, useState} from "react";
import {getCurrentQuest, getTeamObserver} from '../shared/service';

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

export function Game() {
    const [quest, setQuest] = useState<any>(null);
    const [teams, setTeams] = useState<any>(null);

    useEffect(() => {
        const sub = getCurrentQuest().subscribe((res) => {
            setQuest(res);
        });
        const teamSub = getTeamObserver().subscribe((teams) => {
            setTeams(teams)
        });
        return () => {
            sub.unsubscribe();
            teamSub.unsubscribe();
        }
    }, []);

    return <div>
        { quest ?
            <div className="quest">
                { quest.showAnswer ? <div>
                    Правильный ответ: { quest.rightAnswer }
                </div> : <></> }
                <div className="quest-game flex-column-center">
                    <h1>{ quest.text || 'Где логика?' }</h1>
                    <div className="quest-game-images">{ quest.images.map((elem: string, key: number) => <img
                        src={ elem } alt={ 'Quest' }
                        key={ key }/>) }</div>
                </div>
                <div className='quest-answers flex-column-center'>
                    <h2>Порядок ответов:</h2>
                    { quest.answers?.map((el: any, key: number) => <div
                        key={ key }>{ el.name + ' ' + el.time }</div>) }
                </div>
            </div>
            : getLoader()
        }
        { teams ? teams.map((team: any, key: number) => <div
            key={ key }>{ team.name } - { team.score } баллов</div>) : <></> }
    </div>;
}
