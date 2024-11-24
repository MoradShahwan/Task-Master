import "./App.css";
import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Stack,
    LinearProgress,
    Box,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import Swal from 'sweetalert2';

function App() {
    const [inputVal, setInputVal] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdited, setIsEdited] = useState(false);
    const [editedId, setEditedId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
  
    const onChange = (e) => {
      setInputVal(e.target.value);
    };
  
    const getData = () => {
        try {
            const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
            const transformedData = storedTodos.map(todo => ({
                ...todo,
                due: todo.due ? todo.due.toString() : Date.now().toString(),
                isDone: todo.is_completed
            }));
            setTodos(transformedData);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleClick = () => {
        const curTime = selectedDate.valueOf();
        if (!isEdited) {
            const newTodo = {
                id: Date.now(),
                task_title: inputVal,
                due: curTime,
                is_completed: false
            };
            
            const updatedTodos = [...todos, newTodo];
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            getData();
            Swal.fire({
                title: 'Success!',
                text: 'Task added successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            const updatedTodos = todos.map(todo => {
                if (todo.id === editedId) {
                    return {
                        ...todo,
                        task_title: inputVal,
                        due: curTime,
                    };
                }
                return todo;
            });
            
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            getData();
            Swal.fire({
                title: 'Success!',
                text: 'Task updated successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
        setInputVal("");
        setIsEdited(false);
    };
  
    const onDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const newTodos = todos.filter((todo) => todo.id !== id);
                localStorage.setItem('todos', JSON.stringify(newTodos));
                setTodos(newTodos);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your task has been deleted.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };
  
    const handleDone = (id, index) => {
        const newTodos = todos.map((todo, i) => {
            if (i === index) {
                return {
                    ...todo,
                    isDone: !todo.isDone,
                    is_completed: !todo.isDone
                };
            }
            return todo;
        });
        
        localStorage.setItem('todos', JSON.stringify(newTodos));
        setTodos(newTodos);
        Swal.fire({
            title: 'Success!',
            text: newTodos[index].isDone ? 'Task completed!' : 'Task uncompleted',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };
  
    const handleEdit = (id) => {
        const editVal = todos.find((todo) => todo.id === id);
        setEditedId(editVal.id);
        setInputVal(editVal.task_title);
        setSelectedDate(dayjs(Number(editVal.due)));
        setIsEdited(true);
    };
  
    // Calculate completion percentage
    const calculateProgress = () => {
        if (todos.length === 0) return 0;
        const completedTasks = todos.filter(todo => todo.isDone || todo.is_completed).length;
        return (completedTasks / todos.length) * 100;
    };
  
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container component="main" sx={{ margin: "auto", maxWidth: "100%" }}>
                <div className="container-wrapper">
                    <h1 className="title">Task Master</h1>
                    
                    <div className="form-container">
                        <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={3} 
                            sx={{ mb: 3 }}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <TextField
                                variant="outlined"
                                onChange={onChange}
                                label="Type your task"
                                value={inputVal}
                                sx={{ 
                                    minWidth: '250px',
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '10px',
                                    }
                                }}
                            />
                            <DateTimePicker
                                label="Due Date & Time"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                format="DD/MM/YYYY HH:mm"
                                sx={{ 
                                    minWidth: '250px',
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '10px',
                                    }
                                }}
                            />
                            <Button
                                size="large"
                                sx={{
                                    height: 55,
                                    minWidth: '120px',
                                    borderRadius: '10px',
                                    background: isEdited ? 'transparent' : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                    }
                                }}
                                variant={isEdited ? "outlined" : "contained"}
                                color="primary"
                                onClick={handleClick}
                                disabled={inputVal ? false : true}
                            >
                                {isEdited ? "Edit Task" : "Add Task"}
                            </Button>
                        </Stack>
                    </div>

                    <Box sx={{ width: '100%', mb: 4, px: 2 }}>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                            Progress: {Math.round(calculateProgress())}%
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={calculateProgress()} 
                            sx={{ 
                                height: 15,
                                borderRadius: 10,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #4CAF50, #81c784)',
                                    borderRadius: 10,
                                }
                            }}
                        />
                    </Box>

                    <div className="table-container">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '& th': { color: '#fff', fontWeight: 'bold' }
                                    }}>
                                        <TableCell>#</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Due</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {todos.map((todo, index) => (
                                        <TableRow 
                                            key={todo.id || index}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                                '& td': { color: '#fff' }
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell width="45%">
                                                <Typography
                                                    style={{ 
                                                        color: (todo.isDone || todo.is_completed) ? "#4CAF50" : "#fff",
                                                        textDecoration: (todo.isDone || todo.is_completed) ? "line-through" : "none"
                                                    }}
                                                >
                                                    {todo.task_title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell width="20%">
                                                {dayjs(Number(todo.due)).isValid() 
                                                    ? dayjs(Number(todo.due)).format('DD/MM/YYYY HH:mm')
                                                    : 'No date set'}
                                            </TableCell>
                                            <TableCell align="right" width="30%">
                                                <Button
                                                    onClick={() => handleDone(todo.id, index)}
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    sx={{ 
                                                        mr: 1,
                                                        borderRadius: '8px',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                >
                                                    {(todo.isDone || todo.is_completed) ? "Completed" : "Complete"}
                                                </Button>
                                                <Button
                                                    onClick={() => handleEdit(todo.id)}
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    sx={{ 
                                                        mr: 1,
                                                        borderRadius: '8px',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => onDelete(todo.id)}
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    sx={{ 
                                                        borderRadius: '8px',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Container>
        </LocalizationProvider>
    );
}
  
export default App;
  