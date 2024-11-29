
import cron from "node-cron";
import { Job } from "../Models/job.js";
import { User } from "../Models/user.js";
import { sendEmail } from "../Utils/sendEmail.js";

export const newsLetterCron = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log("Cron job started"); 

        try {
            const jobs = await Job.find({ newsLettersSend: false });

            if (jobs.length === 0) {
                console.log("No new jobs to process");
                return; 
            }

            console.log(`Found ${jobs.length} new jobs to process`);

            for (const job of jobs) {
                console.log(`Processing job: ${job.title} at ${job.companyName}`);

                const filteredUsers = await User.find({
                    $or: [
                        { "domains.firstDomain": job.jobDomain },
                        { "domains.secondDomain": job.jobDomain },
                        { "domains.thirdDomain": job.jobDomain },
                    ]
                });

                console.log(`Found ${filteredUsers.length} users for job domain ${job.jobDomain}`);

                for (const user of filteredUsers) {
                    const subject = `Exciting Opportunity: ${job.title} in ${job.jobDomain}`;
                    const message = `Hi ${user.name},

We’re thrilled to share an exciting opportunity with you! We have found a job opening that might be perfect for you: the position of ${job.title} at ${job.companyName}. This role is located in ${job.location} and offers a competitive salary of ${job.salary}. We believe this opportunity aligns well with your career goals and expertise.

If you’re interested or would like to learn more about this position, please let us know. We’re here to help you take the next step in your career journey!

Best regards,
[Your Job Portal Team]`;

                    try {
                        await sendEmail({
                            email: user.email,
                            subject,
                            message
                        });
                        console.log(`Email sent to ${user.email}`);
                    } catch (emailError) {
                        console.error(`Failed to send email to ${user.email}:`, emailError);
                    }
                }

                job.newsLettersSend = true;
                await job.save();
                console.log(`Updated job ${job.title} status to 'newsLettersSend'`);
            }

            console.log("Cron job finished");
        } catch (error) {
            console.error("Error in cron job:", error);
        }
    });
};
