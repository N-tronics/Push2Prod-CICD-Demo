const express=require("express");
const cors=require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app=express();
const prisma=new PrismaClient();
app.use(cors());
app.use(express.json());


app.get("/todos",async(req,res)=>
{
    const todos=await prisma.todo.findMany();
    res.json(todos);
});

app.post("/todos",async (req,res)=>
{
    const {task}= req.body;
    const todo=await prisma.todo.create(
        {
            data:{task}
        }
    );
    res.status(201).json(todo);
})

app.put("/todos/:id",async (req,res)=>
{
    const id=parseInt(req.params.id);
    const current=await prisma.todo.findUnique({ where:{id}});
    const todo=await prisma.todo.update(
        {
            where: {id},
            data:{completed : !current.completed},
        }
    );
    res.json(todo);
})

app.delete("/todos/:id",async(req,res)=>
{
    const id=parseInt(req.params.id);
    await prisma.todo.delete({
        where:{id}
    });
    res.sendStatus(204);
});



app.listen(3000,()=>
{
    console.log("Server is running at port 3000");
})