const styles = theme => ({
    classificationColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        marginTop: 64,
        padding: 20,
    },
    title: {
        marginBottom: '20px'
    },
    element: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    select: {
        width: 120,
        marginTop: 10
    },
    fab: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: 20,
        marginRight: 20,
        color: 'white'
    }
});

export default styles