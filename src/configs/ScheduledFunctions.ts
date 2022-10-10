import CronJob from 'node-cron'

const getHora = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return dd + '/' + mm + '/' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
}


export class ScheduledJob {
    scheduledJobFunction : CronJob.ScheduledTask;

    jobDeleteImages() {
        this.scheduledJobFunction = CronJob.schedule('40 7,13 * * *', () => {
            console.info(getHora() + " Lanzamiento de socket");
    
        });
    }

    start(){
        this.scheduledJobFunction.start()
    }

    constructor(){
        this.jobDeleteImages();
        this.scheduledJobFunction.start()
    }
    
}