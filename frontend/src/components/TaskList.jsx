import React from 'react'
import { useEffect, useState } from 'react'

const TaskList = () => {
    const [tasks, setTasks] = useState()

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
            const res = await fetch('/'+status+'/tasks')
            const data = await res.json()
            console.log(data)
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
            <h1 className="text-3xl text-blue-500 font-bold text-center">Tasks</h1>
            <div className='w-3/5 m-auto my-2'>
                <button className='text-black p-2 rounded mx-2 font-medium hover:bg-blue-600 hover:text-white'
                    onClick={() => fetchTasks()}>All</button>
                <button className='text-black p-2 rounded mx-2 font-medium hover:bg-blue-600 hover:text-white'
                    onClick={() => fetchTaskByStatus(1)}>Completed</button>
                <button className='text-black p-2 rounded mx-2 font-medium hover:bg-blue-600 hover:text-white'
                    onClick={() => fetchTaskByStatus(0)}>In Progress</button>
            </div>
            <div className="my-5">
                <table className="w-3/5 bg-white border border-gray-200 m-auto">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Task</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-medium">
                        {tasks && tasks.map((task, index) => (
                            <tr className="border-b border-gray-200" name={index}>
                                <td className="py-3 px-6 text-left w-48">{task.task}</td>
                                <td className="py-3 px-6 text-left">{task.desc}</td>
                                <td className="py-3 px-6 text-center w-12">
                                    <input type="checkbox" className="form-checkbox text-blue-500" />
                                </td>
                                <td className="py-3 px-6 text-center w-12">
                                    <button className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-200 hover:text-red-500">Delete</button>
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