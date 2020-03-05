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
    let quest: number;

    //mount/unmount
    useEffect(() => {
        const sub = getCurrentQuest().subscribe((res) => {
            if (res.id !== quest) {
                if (quest) {
                    setAnswered(false);
                }
                quest = res.id;
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
        const answered = query.get('answered') === 'true';
        if (teamId && name) {
            setTeam(teamId);
            setName(name);
            setAnswered(answered);
            setNameEdit(false);
        }
    }, [location.search]);

    function createOrUpdate() {
        if (name) {
            if (team) {
                updateTeam(team, name);
                updateLocation({name})
            } else {
                createTeam(name).then((teamData) => {
                    updateLocation({team: teamData.id})
                });
            }
            setNameEdit(false);
        }
    }

    function answer() {
        if (!answered) {
            setAnswered(true);
            addAnswer(name);
            updateLocation({answered: true})
        }
    }

    function updateLocation(searchParams: any) {
        const defaultParams = {name, team, answered};
        const search = new URLSearchParams({...defaultParams, ...searchParams});
        location.search = search.toString();
        history.replace(location);
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
                     className={'ps-Button ' + (answered ? 'ps-Button_selected' : '')}
                     onClick={() => answer()}/>
            </div>
        }
    </div>;
}
