import React from 'react'
import { useEffect, useState } from 'react'
import TaskModal from './TaskModal';
import SnackBar from './SnackBar';

const TaskList = () => {
    const [tasks, setTasks] = useState()
    const [snackbar, setSnackbar] = useState(false)

    const handleSnackbar = () => {
        setSnackbar(false)
    }

    const handleStatus = async (taskId, taskStatus) => {
        try {
            const res = await fetch(`/tasks/${taskId}/${taskStatus === 1 ? 0 : 1}`, {
                method: 'PUT'
            });
            if (res.ok) {
                fetchTasks()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE', })
            if (response.ok) {
                fetchTasks()
                setSnackbar(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks')
            const data = await response.json()
            // console.log(data);
            setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    };

    const fetchTaskByStatus = async (status) => {
        console.log("status  :", status)
        try {
            const res = await fetch('/' + status + '/tasks')
            const data = await res.json()
            // console.log(data)
            setTasks(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, []);


    return (
        <div className="m-auto my-10">
            <SnackBar
                message='Task Deleted Successfully'
                onClose={handleSnackbar}
                isVisible={snackbar}
                textColor={'red'} />
            <h1 className="text-3xl text-gray-300 font-bold text-center mb-5">Tasks</h1>
            <div className='w-3/5 m-auto my-2'>
                <button className='p-2 rounded mx-2 font-medium bg-blue-500 text-white hover:text-blue-700 hover:bg-blue-200'
                    onClick={() => fetchTasks()}>All</button>
                <button className='p-2 rounded mx-2 font-medium bg-blue-500 text-white hover:text-blue-700 hover:bg-blue-200'
                    onClick={() => fetchTaskByStatus(1)}>Completed</button>
                <button className='p-2 rounded mx-2 font-medium bg-blue-500 text-white hover:text-blue-700 hover:bg-blue-200'
                    onClick={() => fetchTaskByStatus(0)}>In Progress</button>
            </div>
            <TaskModal onCreate={fetchTasks} />
            <div className="my-5">
                <table className="w-3/5 bg-gray-300 m-auto">
                    <thead>
                        <tr className="bg-gray-500 text-black uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Task</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-md font-medium">
                        {tasks && tasks.map((task, index) => (
                            <tr className="border-b border-gray-200" name={index}>
                                <td className="py-3 px-6 text-left w-48">{task.task}</td>
                                <td className="py-3 px-6 text-left">{task.desc}</td>
                                <td className="py-3 px-6 text-center w-12">
                                    <input type="checkbox"
                                        className="form-checkbox text-blue-500"
                                        onChange={() => handleStatus(task.id, task.status)}
                                        checked={task.status === 1} />
                                </td>
                                <td className="py-3 px-6 text-center w-12">
                                    <button
                                        className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-200 hover:text-red-500"
                                        onClick={() => { handleDelete(task.id) }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TaskList