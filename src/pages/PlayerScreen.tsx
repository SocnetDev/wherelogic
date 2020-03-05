import React, {useState, ChangeEvent, useEffect} from "react";
import {createTeam, updateTeam, getCurrentQuest, addAnswer} from "../shared/service";
import {
    useLocation,
    useHistory
} from "react-router-dom";
import './PlayerScreen.css';

export function PlayerScreen() {
    const location = useLocation();
    const history = useHistory();
    const [team, setTeam] = useState<string>('');
    const [name, setName] = useState<any>('');
    const [answered, setAnswered] = useState<boolean>(false);
    const [nameEdit, setNameEdit] = useState<boolean>(true);
    const [curQuest, setCurQuest] = useState<any>();
    let quest: any;

    //mount/unmount
    useEffect(() => {
        const sub = getCurrentQuest().subscribe((res) => {
            if (!quest || res.id !== quest.id) {
                quest = res;
                setAnswered(false);
                setCurQuest(quest);

                //TODO: расширить запись ответа на id команды и проверять на наличие ответа

            }
        });
        return () => {
            sub.unsubscribe();
        }
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const teamId = query.get('team');
        const name = query.get('name');
        if (teamId && name) {
            setTeam(teamId);
            setName(name);
            setNameEdit(false);
        }
    }, [location.search]);

    function createOrUpdate() {
        if (name) {
            if (team) {
                updateTeam(team, name);
                const search = new URLSearchParams({name, team});
                location.search = search.toString();
                history.replace(location);
            } else {
                createTeam(name).then((teamData) => {
                    const search = new URLSearchParams({name, team: teamData.id});
                    location.search = search.toString();
                    history.replace(location);
                });
            }
            setNameEdit(false);
        }
    }

    function answer() {
        if (!answered && curQuest) {
            setAnswered(true);
            addAnswer(name);
        }
    }

    // Тут короче то что видит игрок, а именно большую кнопку)
    // По ней для простоты будем в ФБ записывать имя команды и время и показывать на экране список формата
    // КОМАНДА А - 10:04:55
    // Перед кнопкой надо запросить ввести имя команды
    return <div className='ps-Base'>
        {nameEdit ?
            <div className='ps-NameBlock'>
                <input type="text"
                       className='ps-NameBlock__name ps-NameBlock__name_input'
                       value={name}
                       placeholder="Введите название команды"
                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
                           setName(e.target.value)
                       }}/>
                <button onClick={() => createOrUpdate()}>{team ? 'Обновить' : 'Создать'} команду</button>
            </div>
            :
            <div className='ps-Base__wrapper'>
                <div className='ps-NameBlock'>
                    <div className='ps-NameBlock__name'>{name}</div>
                    <button onClick={() => setNameEdit(true)}>Отредактировать имя</button>
                </div>
                <img src='./button.svg' alt='press me'
                     className={'ps-Button ' + (answered || !curQuest ? 'ps-Button_selected' : '')}
                     onClick={() => answer()}/>
            </div>
        }
    </div>;
}
