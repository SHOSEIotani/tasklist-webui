import { useCallback, useEffect, useState } from "react";
import client from "../libs/axios";
import style from "./app.module.scss";
//edited by member A
type Task = {
  id: string;
  name: string;
  done: boolean;
}
const App = () => {
  const [name, setName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // データ取得のロジック
  const refresh = useCallback(() => {
    client.get("/tasks").then(res => {
      setTasks(res.data);
    }).catch(err => {console.log(err);});
  }, [setTasks]);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div>
        <input type="text" value={name} onChange={(v) => setName(v.target.value)} />
        <button
          onClick={() => {
            // 新規追加のロジック
            client.post("/tasks", {
              name
            }).then(res => {
              refresh();
            }).catch(err => {console.log(err);});
          }}>タスク追加
        </button>
      </div>
      <div>
        {tasks.map(task => (
          <div key={task.id} style={{display: "flex"}}>
            <input type="checkbox" checked={task.done} onChange={() => {
              // 完了切り替えのロジック
              client.put(`/tasks/${task.id}`, {
                name: task.name,
                done: !task.done
              }).then(res => {
                refresh();
              }).catch(err => {console.log(err);});
            }} />
            <p className={style.taskName}>
              {task.name}
            </p>
            <button className={style.removeButton} onClick={() => {
              // 削除のロジック
              client.delete(`/tasks/${task.id}`).then(res => {
                refresh();
              }).catch(err => {console.log(err);});
            }}>削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
