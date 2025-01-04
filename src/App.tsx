// src/App.tsx

import { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import {
    Container,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
    Paper,
    Grid
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface Item {
    id: number
    name: string
    price: number
}

function App() {
    const [items, setItems] = useState<Item[]>([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')

    // Завантажуємо items із бекенду на монтуванні
    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const response = await axios.get<Item[]>('http://localhost:1337/items')
            setItems(response.data)
        } catch (error) {
            console.error('Failed to fetch items', error)
        }
    }

    const handleAddItem = async (e: FormEvent) => {
        e.preventDefault()
        const parsedPrice = parseFloat(price)
        if (!name || isNaN(parsedPrice)) {
            return alert('Name must be non-empty, Price must be a valid number.')
        }
        try {
            const response = await axios.post<Item>('http://localhost:1337/items', {
                name,
                price: parsedPrice,
            })
            setItems((prev) => [...prev, response.data])
            setName('')
            setPrice('')
        } catch (error) {
            console.error('Failed to add item', error)
        }
    }

    const handleDeleteItem = async (id: number) => {
        try {
            await axios.delete(`http://localhost:1337/items/${id}`)
            setItems((prev) => prev.filter((item) => item.id !== id))
        } catch (error) {
            console.error('Failed to delete item', error)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h3" gutterBottom>
                Items Manager
            </Typography>

            {/* Paper (щоб створити "карточку" для форми) */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Add a new item
                </Typography>
                <Box component="form" onSubmit={handleAddItem} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price"
                                variant="outlined"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained">
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Список items або повідомлення, якщо порожньо */}
            {items.length === 0 ? (
                <Typography
                    variant="body1"
                    sx={{ color: '#fff' }} // Яскравий колір тексту на темному фоні
                >
                    No items found.
                </Typography>
            ) : (
                <List
                    sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                    }}
                >
                    {items.map((item) => (
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={item.name}
                                secondary={`Price: ${item.price}`}
                                // Ось ця частина робить текст у полі primary чорним:
                                primaryTypographyProps={{ sx: { color: '#000' } }}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    )
}

export default App