import React from 'react'
import { useState } from 'react'
import SnackBar from './SnackBar'

const TaskModal = ({ onCreate }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [snackbar, setSnackbar] = useState(false)

    const [taskData, setTaskData] = useState({
        task: "",
        description: '',
    })

    const handleSnackbar = () => {
        setSnackbar(false)
    }


    const handleModal = () => {
        setIsOpen(!isOpen)
        // console.log(isOpen)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(taskData)
        try {
            const res = await fetch('/tasks', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(taskData)
            })
            if (res.ok) {
                // console.log('Task created')
                setIsOpen(false)
                setSnackbar(true)
                onCreate()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {snackbar &&
                <SnackBar
                    message='Task Created Successfully'
                    onClose={handleSnackbar}
                    isVisible={snackbar}
                    textColor={'green'} />
            }
            <button
                className='bg-green-700 font-medium text-white px-3 py-2 rounded hover:bg-green-400 hover:text-green-700 my-4'
                onClick={handleModal}>
                Create task
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-400 w-2/5 h-3/4 m-auto rounded-lg">
                    <div>
                        <h1 className='font-bold text-2xl text-blue-700 mb-2'>Create New Task</h1>
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1">
                                <label for="email" className="text-lg font-bold text-black">Task Title</label>
                                <input type="text" id="title" name="title" required
                                    className="w-full p-3 rounded-lg text-gray-800 font-semibold bg-transparent border border-black focus:outline-none focus:border-blue-500"
                                    onChange={(e) => { setTaskData({ ...taskData, task: e.target.value }) }} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label for="textarea" className="text-lg font-bold text-black">Task Description</label>
                                <textarea name="desc" id="desc" rows="10" cols="50" required
                                    className="w-full p-3 rounded-lg text-gray-800 font-semibold bg-transparent border border-black focus:outline-none focus:border-blue-500"
                                    onChange={(e) => { setTaskData({ ...taskData, description: e.target.value }) }}></textarea>
                            </div>
                            <div className='flex justify-between'>
                                <button
                                    className="w-32 mt-2 p-3 text-sm font-bold text-white bg-red-700 rounded-md hover:bg-red-300 hover:text-black"
                                    onClick={handleModal}>CLOSE</button>
                                <button type="submit"
                                    className="w-32 mt-2 p-3 text-sm font-bold text-white bg-green-700 rounded-md hover:bg-green-300 hover:text-black"
                                >CREATE</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default TaskModal