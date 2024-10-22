import '../css/myTaks.css'

function Tasks() {
    return (
        <>
          <article className="TopArticle">
            <div className="title">
                <h1>My Tasks</h1>
            </div>
          </article>
          <article className="BottomArticle">
            <div className="tasksDiv">
              <div className='gridItem item1'>
              <h2>In progress</h2>
              <div className='taskSect'>
                <div className="taskDetails">
                  <h3>Team: <p>dfgiop;lkjhgfghj</p></h3>
                  <h3>Task:<p></p></h3>
                  <h3>Due:<p></p></h3>
                </div>
                <div className="taskDetails">
                  <h3>Team:<p></p></h3>
                  <h3>Task:<p></p></h3>
                  <h3>Due:<p></p></h3>
                  </div>
                  <div className="taskDetails">
                  <h3>Team:<p></p></h3>
                  <h3>Task:<p></p></h3>
                  <h3>Due:<p></p></h3>
                  </div>
              </div>
              </div>
              <div className='gridItem item2'>
                <h2>In progress</h2>
                <div className='taskSect'>
                <div className="taskDetails">
                  <h3>Team: <p>dfgiop;lkjhgfghj</p></h3>
                  <h3>Task:<p></p></h3>
                  <h3>Due:<p></p></h3>
                </div>
                  <div className="taskDetails">
                  <h3>Team:<p></p></h3>
                  <h3>Task:<p></p></h3>
                  <h3>Due:<p></p></h3>
                  </div>
              </div>
              </div>
              <div className='gridItem item3'>
                <h2>Completed</h2>
                <div className='taskSect'>
                <div className="taskDetails">
                  <h3>Team: <p>dfgiop;lkjhgfghj</p></h3>
                  <h3>Task:<p></p></h3>
                  <h3>Due:<p></p></h3>
                </div>
              </div>
              </div>
            </div>
          </article>
        </>
    );
}

export default Tasks;
