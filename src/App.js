import { Button, Heading, Pane, Table, TextInputField } from "evergreen-ui"
import React, { useEffect, useState } from "react"

import { useMongoDB } from "./providers/mongodb"
import { useRealmApp } from "./providers/realm"

function LogInForm(props) {
    return (
        <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={50}>
            <Pane width="50%" padding={16} background="purpleTint" borderRadius={3} elevation={4}>
                <Heading size={800} marginTop="10" marginBottom="10">
                    Log in
                </Heading>
                <Pane>
                    <TextInputField
                        label="Username"
                        required
                        placeholder="mongodb@example.com"
                        onChange={(e) => props.setEmail(e.target.value)}
                        value={props.email}
                    />
                </Pane>
                <Pane>
                    <TextInputField
                        label="Password"
                        required
                        placeholder="**********"
                        type="password"
                        onChange={(e) => props.setPassword(e.target.value)}
                        value={props.password}
                    />
                </Pane>
                <Button appearance="primary" onClick={props.handleLogIn}>
                    Log in
                </Button>
            </Pane>
        </Pane>
    )
}

function MovieList(props) {
    return (
        <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={50}>
            <Pane width="50%" padding={16} background="purpleTint" borderRadius={3} elevation={4}>
                <Table>
                    <Table.Head>
                        <Table.TextHeaderCell>Title</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Plot</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Rating</Table.TextHeaderCell>
                        <Table.TextHeaderCell>Year</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body height={240}>
                        {props.movies.map((movie) => (
                            <Table.Row key={movie._id}>
                                <Table.TextCell>{movie.title}</Table.TextCell>
                                <Table.TextCell>{movie.plot}</Table.TextCell>
                                <Table.TextCell>{movie.rated}</Table.TextCell>
                                <Table.TextCell isNumber>{movie.year}</Table.TextCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <Button
                    height={50}
                    marginRight={16}
                    appearance="primary"
                    intent="danger"
                    onClick={props.logOut}
                >
                    Log Out
                </Button>
            </Pane>
        </Pane>
    )
}

function App() {
    const { logIn, logOut, user } = useRealmApp()
    const { db } = useMongoDB()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [movies, setMovies] = useState([])

    useEffect(() => {
        async function wrapMovieQuery() {
            if (user && db) {
                const authoredMovies = await db.collection("movies").find()
                setMovies(authoredMovies)
            }
        }
        wrapMovieQuery()
    }, [user, db])

    async function handleLogIn() {
        await logIn(email, password)
    }

    return user && db && user.state === "active" ? (
        <MovieList movies={movies} user={user} logOut={logOut} />
    ) : (
        <LogInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogIn={handleLogIn}
        />
    )
}

export default App
