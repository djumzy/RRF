import { db } from '../db';
import { users, courses, enrollments, permacultureInfo } from '@shared/schema';

async function checkDatabase() {
  try {
    console.log('\n=== Database Contents ===\n');

    // Check Users
    console.log('Users:');
    const allUsers = await db.select().from(users);
    console.log(JSON.stringify(allUsers, null, 2));
    console.log('\nTotal Users:', allUsers.length);

    // Check Courses
    console.log('\nCourses:');
    const allCourses = await db.select().from(courses);
    console.log(JSON.stringify(allCourses, null, 2));
    console.log('\nTotal Courses:', allCourses.length);

    // Check Enrollments
    console.log('\nEnrollments:');
    const allEnrollments = await db.select().from(enrollments);
    console.log(JSON.stringify(allEnrollments, null, 2));
    console.log('\nTotal Enrollments:', allEnrollments.length);

    // Check Permaculture Info
    console.log('\nPermaculture Info:');
    const allPermacultureInfo = await db.select().from(permacultureInfo);
    console.log(JSON.stringify(allPermacultureInfo, null, 2));
    console.log('\nTotal Permaculture Info Items:', allPermacultureInfo.length);

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase(); 