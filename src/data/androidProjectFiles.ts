import { AndroidProjectFile } from '../types/task';

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (Module :app)',
    language: 'kotlin',
    category: 'build',
    description: 'Gradle configuration containing Room, Compose BOM, Navigation, WorkManager, and Material3 dependencies.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.taskpulse.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.taskpulse.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Core KTX
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose BOM & UI
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Jetpack Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // ViewModel & Lifecycle for Compose
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Room Persistence Library (Local SQLite Database)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // WorkManager (Background Scheduling & Periodic Workers)
    implementation("androidx.work:work-runtime-ktx:2.10.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    category: 'manifest',
    description: 'Declares Android 13+ POST_NOTIFICATIONS, exact alarm, and device boot permissions.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Android 13+ (API 33) Runtime Notification Permission -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Exact Alarm scheduling for reliable task reminders (Android 12+) -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />

    <!-- Restore alarms after phone restart -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <!-- Vibration and wake lock for audible alerts -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:name=".TaskPulseApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.TaskPulse"
        tools:targetApi="35">

        <!-- Main Launcher Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.TaskPulse"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Deep linking directly into task details -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <data
                    android:scheme="taskpulse"
                    android:host="task" />
            </intent-filter>
        </activity>

        <!-- BroadcastReceiver for scheduled task alarm notifications -->
        <receiver
            android:name=".notification.TaskAlarmReceiver"
            android:enabled="true"
            android:exported="false" />

        <!-- BroadcastReceiver to reschedule alarms upon system boot -->
        <receiver
            android:name=".notification.BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>

    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/data/model/Priority.kt',
    name: 'Priority.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Enum representing Task priority levels with ordering and display metadata.',
    content: `package com.taskpulse.app.data.model

/**
 * Task priority levels with display values and order weighting.
 */
enum class Priority(val displayName: String, val level: Int) {
    LOW("Low", 1),
    MEDIUM("Medium", 2),
    HIGH("High", 3);

    companion object {
        fun fromString(value: String): Priority {
            return entries.firstOrNull { it.name.equals(value, ignoreCase = true) } ?: MEDIUM
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/data/model/Task.kt',
    name: 'Task.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Room Entity representing a Task in the local SQLite database.',
    content: `package com.taskpulse.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Room Entity representing a single Task item.
 *
 * @property id Unique auto-generated primary key
 * @property title Required title of the task
 * @property description Optional details or notes
 * @property dueDate Epoch timestamp in milliseconds when the task is due
 * @property priority Priority level (LOW, MEDIUM, HIGH)
 * @property isCompleted Whether the task has been checked off
 * @property notificationEnabled Whether a local alarm reminder is scheduled
 * @property createdAt Epoch timestamp when task was created
 */
@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String = "",
    val dueDate: Long,
    val priority: Priority = Priority.MEDIUM,
    val isCompleted: Boolean = false,
    val notificationEnabled: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/data/local/TaskDao.kt',
    name: 'TaskDao.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Room Data Access Object (DAO) returning reactive Kotlin Coroutine Flows.',
    content: `package com.taskpulse.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.taskpulse.app.data.model.Task
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object providing reactive queries with Kotlin Flow.
 */
@Dao
interface TaskDao {

    /**
     * Emits all tasks ordered by completion status then due date.
     */
    @Query("SELECT * FROM tasks ORDER BY isCompleted ASC, dueDate ASC")
    fun getAllTasks(): Flow<List<Task>>

    /**
     * Retrieves a single task by ID.
     */
    @Query("SELECT * FROM tasks WHERE id = :taskId")
    suspend fun getTaskById(taskId: Long): Task?

    /**
     * Retrieves a reactive stream of a single task.
     */
    @Query("SELECT * FROM tasks WHERE id = :taskId")
    fun getTaskByIdFlow(taskId: Long): Flow<Task?>

    /**
     * Retrieves all pending tasks that require active notification rescheduling on boot.
     */
    @Query("SELECT * FROM tasks WHERE isCompleted = 0 AND notificationEnabled = 1 AND dueDate > :currentTime")
    suspend fun getPendingNotificationTasks(currentTime: Long): List<Task>

    /**
     * Inserts a task, replacing if conflict arises.
     * Returns the newly generated row ID.
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: Task): Long

    /**
     * Updates an existing task.
     */
    @Update
    suspend fun updateTask(task: Task)

    /**
     * Deletes a specific task.
     */
    @Delete
    suspend fun deleteTask(task: Task)

    /**
     * Deletes a task by ID.
     */
    @Query("DELETE FROM tasks WHERE id = :taskId")
    suspend fun deleteTaskById(taskId: Long)

    /**
     * Toggles the completion status of a task.
     */
    @Query("UPDATE tasks SET isCompleted = :isCompleted WHERE id = :taskId")
    suspend fun updateCompletionStatus(taskId: Long, isCompleted: Boolean)
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/data/local/TaskPulseDatabase.kt',
    name: 'TaskPulseDatabase.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Thread-safe Singleton Room Database configuration.',
    content: `package com.taskpulse.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.taskpulse.app.data.model.Task

/**
 * Main Room Database for the TaskPulse application.
 */
@Database(
    entities = [Task::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class TaskPulseDatabase : RoomDatabase() {

    abstract fun taskDao(): TaskDao

    companion object {
        @Volatile
        private var INSTANCE: TaskPulseDatabase? = null

        fun getDatabase(context: Context): TaskPulseDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TaskPulseDatabase::class.java,
                    "taskpulse_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/data/local/Converters.kt',
    name: 'Converters.kt',
    language: 'kotlin',
    category: 'data',
    description: 'TypeConverters for Room to store Priority enums cleanly.',
    content: `package com.taskpulse.app.data.local

import androidx.room.TypeConverter
import com.taskpulse.app.data.model.Priority

/**
 * Room TypeConverter for Priority enum.
 */
class Converters {
    @TypeConverter
    fun fromPriority(priority: Priority): String {
        return priority.name
    }

    @TypeConverter
    fun toPriority(value: String): Priority {
        return Priority.fromString(value)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/data/repository/TaskRepository.kt',
    name: 'TaskRepository.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Clean Architecture repository managing database CRUD and notification coordination.',
    content: `package com.taskpulse.app.data.repository

import com.taskpulse.app.data.local.TaskDao
import com.taskpulse.app.data.model.Task
import com.taskpulse.app.notification.AlarmScheduler
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface defining data operations for Tasks.
 */
interface TaskRepository {
    fun getAllTasks(): Flow<List<Task>>
    suspend fun getTaskById(taskId: Long): Task?
    suspend fun insertTask(task: Task): Long
    suspend fun updateTask(task: Task)
    suspend fun deleteTask(task: Task)
    suspend fun toggleTaskCompletion(task: Task)
    suspend fun rescheduleAllPendingAlarms()
}

/**
 * Production implementation coordinating Room persistence and AlarmScheduler.
 */
class TaskRepositoryImpl(
    private val taskDao: TaskDao,
    private val alarmScheduler: AlarmScheduler
) : TaskRepository {

    override fun getAllTasks(): Flow<List<Task>> = taskDao.getAllTasks()

    override suspend fun getTaskById(taskId: Long): Task? = taskDao.getTaskById(taskId)

    override suspend fun insertTask(task: Task): Long {
        val insertedId = taskDao.insertTask(task)
        val fullTask = task.copy(id = insertedId)

        // Schedule notification if reminder enabled and task is not yet completed
        if (fullTask.notificationEnabled && !fullTask.isCompleted && fullTask.dueDate > System.currentTimeMillis()) {
            alarmScheduler.scheduleAlarm(fullTask)
        }
        return insertedId
    }

    override suspend fun updateTask(task: Task) {
        taskDao.updateTask(task)

        // Manage alarm schedule
        if (task.isCompleted || !task.notificationEnabled || task.dueDate <= System.currentTimeMillis()) {
            alarmScheduler.cancelAlarm(task.id)
        } else {
            alarmScheduler.scheduleAlarm(task)
        }
    }

    override suspend fun deleteTask(task: Task) {
        alarmScheduler.cancelAlarm(task.id)
        taskDao.deleteTask(task)
    }

    override suspend fun toggleTaskCompletion(task: Task) {
        val updated = task.copy(isCompleted = !task.isCompleted)
        updateTask(updated)
    }

    override suspend fun rescheduleAllPendingAlarms() {
        val pendingTasks = taskDao.getPendingNotificationTasks(System.currentTimeMillis())
        for (task in pendingTasks) {
            alarmScheduler.scheduleAlarm(task)
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/notification/AlarmScheduler.kt',
    name: 'AlarmScheduler.kt',
    language: 'kotlin',
    category: 'notification',
    description: 'Schedules exact alarms with AlarmManager even in Doze Mode (Android 12+ compliant).',
    content: `package com.taskpulse.app.notification

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.taskpulse.app.data.model.Task

interface AlarmScheduler {
    fun scheduleAlarm(task: Task)
    fun cancelAlarm(taskId: Long)
}

/**
 * Concrete implementation using Android system AlarmManager.
 * Employs setExactAndAllowWhileIdle for accurate reminders across Doze states.
 */
class AndroidAlarmScheduler(private val context: Context) : AlarmScheduler {

    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    override fun scheduleAlarm(task: Task) {
        // Do not schedule past due tasks
        if (task.dueDate <= System.currentTimeMillis()) return

        val intent = Intent(context, TaskAlarmReceiver::class.java).apply {
            putExtra(TaskAlarmReceiver.EXTRA_TASK_ID, task.id)
            putExtra(TaskAlarmReceiver.EXTRA_TASK_TITLE, task.title)
            putExtra(TaskAlarmReceiver.EXTRA_TASK_DESC, task.description)
            putExtra(TaskAlarmReceiver.EXTRA_TASK_PRIORITY, task.priority.name)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            task.id.toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        try {
            // Check for exact alarm permission on Android 12+ (API 31)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (!alarmManager.canScheduleExactAlarms()) {
                    Log.w("AlarmScheduler", "Exact alarms permission not granted. Scheduling standard alarm.")
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        task.dueDate,
                        pendingIntent
                    )
                    return
                }
            }

            // Reliable exact reminder firing even in low-power idle/Doze states
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                task.dueDate,
                pendingIntent
            )
            Log.d("AlarmScheduler", "Alarm scheduled successfully for task '\${task.title}' at \${task.dueDate}")
        } catch (e: SecurityException) {
            Log.e("AlarmScheduler", "SecurityException scheduling exact alarm", e)
        }
    }

    override fun cancelAlarm(taskId: Long) {
        val intent = Intent(context, TaskAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            taskId.toInt(),
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )

        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
            Log.d("AlarmScheduler", "Cancelled alarm for task ID: $taskId")
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/notification/NotificationHelper.kt',
    name: 'NotificationHelper.kt',
    language: 'kotlin',
    category: 'notification',
    description: 'NotificationChannel setup for Android 8.0+ and rich heads-up notification builder.',
    content: `package com.taskpulse.app.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import com.taskpulse.app.MainActivity
import com.taskpulse.app.R

/**
 * Handles creation of Notification Channels and builds rich Heads-up Notifications.
 */
class NotificationHelper(private val context: Context) {

    companion object {
        const val CHANNEL_ID = "taskpulse_reminder_channel"
        const val CHANNEL_NAME = "Task Reminders"
        const val CHANNEL_DESC = "Notifications for scheduled TaskPulse reminders and due dates"
    }

    private val notificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    /**
     * Initializes High-Importance Notification Channel for Android 8.0 (API 26) and above.
     */
    fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            val audioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .build()

            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESC
                enableLights(true)
                lightColor = Color.BLUE
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 300, 200, 300)
                setSound(soundUri, audioAttributes)
            }
            notificationManager.createNotificationChannel(channel)
        }
    }

    /**
     * Dispatches the heads-up notification with a PendingIntent to deep link into MainActivity.
     */
    fun showTaskNotification(taskId: Long, title: String, description: String, priorityName: String) {
        val deepLinkIntent = Intent(context, MainActivity::class.java).apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse("taskpulse://task/$taskId")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            taskId.toInt(),
            deepLinkIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val priorityText = when (priorityName.uppercase()) {
            "HIGH" -> "[HIGH PRIORITY] "
            "MEDIUM" -> "[Medium Priority] "
            else -> ""
        }

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("\${priorityText}\$title")
            .setContentText(description.ifBlank { "Your scheduled task is due now!" })
            .setStyle(NotificationCompat.BigTextStyle().bigText(description.ifBlank { "Task '\$title' is due now. Open TaskPulse to review." }))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()

        notificationManager.notify(taskId.toInt(), notification)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/notification/TaskAlarmReceiver.kt',
    name: 'TaskAlarmReceiver.kt',
    language: 'kotlin',
    category: 'notification',
    description: 'BroadcastReceiver that executes when scheduled AlarmManager fires.',
    content: `package com.taskpulse.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * BroadcastReceiver triggered by AlarmManager when a task reminder is due.
 */
class TaskAlarmReceiver : BroadcastReceiver() {

    companion object {
        const val EXTRA_TASK_ID = "extra_task_id"
        const val EXTRA_TASK_TITLE = "extra_task_title"
        const val EXTRA_TASK_DESC = "extra_task_desc"
        const val EXTRA_TASK_PRIORITY = "extra_task_priority"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val taskId = intent.getLongExtra(EXTRA_TASK_ID, -1L)
        val title = intent.getStringExtra(EXTRA_TASK_TITLE) ?: "Task Reminder"
        val description = intent.getStringExtra(EXTRA_TASK_DESC) ?: ""
        val priority = intent.getStringExtra(EXTRA_TASK_PRIORITY) ?: "MEDIUM"

        Log.d("TaskAlarmReceiver", "Received alarm trigger for Task ID: $taskId, Title: $title")

        if (taskId != -1L) {
            val notificationHelper = NotificationHelper(context)
            notificationHelper.showTaskNotification(taskId, title, description, priority)
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/notification/BootReceiver.kt',
    name: 'BootReceiver.kt',
    language: 'kotlin',
    category: 'notification',
    description: 'Re-schedules all pending alarms following device reboot or power on.',
    content: `package com.taskpulse.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.taskpulse.app.data.local.TaskPulseDatabase
import com.taskpulse.app.data.repository.TaskRepositoryImpl
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Reschedules all upcoming task alarms after the Android device reboots.
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON"
        ) {
            Log.d("BootReceiver", "Device reboot detected. Re-scheduling pending task reminders...")

            val pendingResult = goAsync()
            val database = TaskPulseDatabase.getDatabase(context)
            val alarmScheduler = AndroidAlarmScheduler(context)
            val repository = TaskRepositoryImpl(database.taskDao(), alarmScheduler)

            CoroutineScope(Dispatchers.IO).launch {
                try {
                    repository.rescheduleAllPendingAlarms()
                    Log.d("BootReceiver", "Successfully restored all pending task alarms.")
                } catch (e: Exception) {
                    Log.e("BootReceiver", "Error restoring task alarms on boot", e)
                } finally {
                    pendingResult.finish()
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/notification/TaskReminderWorker.kt',
    name: 'TaskReminderWorker.kt',
    language: 'kotlin',
    category: 'notification',
    description: 'Jetpack WorkManager implementation for battery-efficient or periodic background reminders.',
    content: `package com.taskpulse.app.notification

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.taskpulse.app.data.local.TaskPulseDatabase

/**
 * Optional WorkManager worker for guaranteed background execution or periodic maintenance.
 */
class TaskReminderWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val taskId = inputData.getLong("TASK_ID", -1L)
        if (taskId == -1L) return Result.failure()

        val database = TaskPulseDatabase.getDatabase(applicationContext)
        val task = database.taskDao().getTaskById(taskId)

        return if (task != null && !task.isCompleted) {
            NotificationHelper(applicationContext).showTaskNotification(
                taskId = task.id,
                title = task.title,
                description = task.description,
                priorityName = task.priority.name
            )
            Result.success()
        } else {
            Result.success()
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/viewmodel/TaskUiState.kt',
    name: 'TaskUiState.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Immutable UI State representing the TaskPulse screen for StateFlow.',
    content: `package com.taskpulse.app.ui.viewmodel

import com.taskpulse.app.data.model.Priority
import com.taskpulse.app.data.model.Task

/**
 * Filter criteria for task list.
 */
enum class TaskFilter {
    ALL,
    PENDING,
    COMPLETED,
    HIGH_PRIORITY,
    TODAY
}

/**
 * Sorting options for tasks.
 */
enum class TaskSort {
    DUE_DATE_ASC,
    DUE_DATE_DESC,
    PRIORITY_DESC,
    TITLE_ASC
}

/**
 * StateFlow UI state holding the current tasks and user filter selections.
 */
data class TaskUiState(
    val tasks: List<Task> = emptyList(),
    val filteredTasks: List<Task> = emptyList(),
    val currentFilter: TaskFilter = TaskFilter.ALL,
    val currentSort: TaskSort = TaskSort.DUE_DATE_ASC,
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val recentlyDeletedTask: Task? = null,
    val selectedTaskForEdit: Task? = null,
    val isAddEditSheetOpen: Boolean = false
)
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/viewmodel/TaskViewModel.kt',
    name: 'TaskViewModel.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'MVVM ViewModel exposing StateFlow for reactive, lifecycle-aware Jetpack Compose state.',
    content: `package com.taskpulse.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.taskpulse.app.data.model.Priority
import com.taskpulse.app.data.model.Task
import com.taskpulse.app.data.repository.TaskRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.Calendar

/**
 * ViewModel managing Task state, filtering, sorting, and user actions.
 */
class TaskViewModel(
    private val repository: TaskRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TaskUiState(isLoading = true))
    val uiState: StateFlow<TaskUiState> = _uiState.asStateFlow()

    init {
        loadTasks()
    }

    private fun loadTasks() {
        viewModelScope.launch {
            repository.getAllTasks()
                .catch { e ->
                    _uiState.update { it.copy(isLoading = false) }
                }
                .collect { taskList ->
                    _uiState.update { state ->
                        state.copy(
                            tasks = taskList,
                            filteredTasks = applyFilterAndSort(
                                tasks = taskList,
                                filter = state.currentFilter,
                                sort = state.currentSort,
                                query = state.searchQuery
                            ),
                            isLoading = false
                        )
                    }
                }
        }
    }

    fun setFilter(filter: TaskFilter) {
        _uiState.update { state ->
            state.copy(
                currentFilter = filter,
                filteredTasks = applyFilterAndSort(state.tasks, filter, state.currentSort, state.searchQuery)
            )
        }
    }

    fun setSort(sort: TaskSort) {
        _uiState.update { state ->
            state.copy(
                currentSort = sort,
                filteredTasks = applyFilterAndSort(state.tasks, state.currentFilter, sort, state.searchQuery)
            )
        }
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.update { state ->
            state.copy(
                searchQuery = query,
                filteredTasks = applyFilterAndSort(state.tasks, state.currentFilter, state.currentSort, query)
            )
        }
    }

    fun toggleTaskCompletion(task: Task) {
        viewModelScope.launch {
            repository.toggleTaskCompletion(task)
        }
    }

    fun saveTask(
        id: Long = 0,
        title: String,
        description: String,
        dueDate: Long,
        priority: Priority,
        notificationEnabled: Boolean
    ) {
        viewModelScope.launch {
            val task = Task(
                id = id,
                title = title.trim(),
                description = description.trim(),
                dueDate = dueDate,
                priority = priority,
                notificationEnabled = notificationEnabled
            )
            if (id == 0L) {
                repository.insertTask(task)
            } else {
                repository.updateTask(task)
            }
            closeAddEditSheet()
        }
    }

    fun deleteTask(task: Task) {
        viewModelScope.launch {
            repository.deleteTask(task)
            _uiState.update { it.copy(recentlyDeletedTask = task) }
        }
    }

    fun restoreDeletedTask() {
        val taskToRestore = _uiState.value.recentlyDeletedTask ?: return
        viewModelScope.launch {
            repository.insertTask(taskToRestore)
            _uiState.update { it.copy(recentlyDeletedTask = null) }
        }
    }

    fun openAddTaskSheet() {
        _uiState.update { it.copy(selectedTaskForEdit = null, isAddEditSheetOpen = true) }
    }

    fun openEditTaskSheet(task: Task) {
        _uiState.update { it.copy(selectedTaskForEdit = task, isAddEditSheetOpen = true) }
    }

    fun closeAddEditSheet() {
        _uiState.update { it.copy(isAddEditSheetOpen = false, selectedTaskForEdit = null) }
    }

    private fun applyFilterAndSort(
        tasks: List<Task>,
        filter: TaskFilter,
        sort: TaskSort,
        query: String
    ): List<Task> {
        val calendar = Calendar.getInstance()
        val startOfDay = calendar.apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis

        val endOfDay = startOfDay + (24 * 60 * 60 * 1000)

        // 1. Filter
        val filtered = tasks.filter { task ->
            val matchesQuery = query.isBlank() ||
                task.title.contains(query, ignoreCase = true) ||
                task.description.contains(query, ignoreCase = true)

            val matchesFilter = when (filter) {
                TaskFilter.ALL -> true
                TaskFilter.PENDING -> !task.isCompleted
                TaskFilter.COMPLETED -> task.isCompleted
                TaskFilter.HIGH_PRIORITY -> task.priority == Priority.HIGH
                TaskFilter.TODAY -> task.dueDate in startOfDay..endOfDay
            }

            matchesQuery && matchesFilter
        }

        // 2. Sort
        return when (sort) {
            TaskSort.DUE_DATE_ASC -> filtered.sortedBy { it.dueDate }
            TaskSort.DUE_DATE_DESC -> filtered.sortedByDescending { it.dueDate }
            TaskSort.PRIORITY_DESC -> filtered.sortedByDescending { it.priority.level }
            TaskSort.TITLE_ASC -> filtered.sortedBy { it.title.lowercase() }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/theme/Color.kt',
    name: 'Color.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Material Design 3 color palette definitions.',
    content: `package com.taskpulse.app.ui.theme

import androidx.compose.ui.graphics.Color

// Light Scheme Colors
val PrimaryLight = Color(0xFF0F6CBD)
val OnPrimaryLight = Color(0xFFFFFFFF)
val PrimaryContainerLight = Color(0xFFD3E4FF)
val OnPrimaryContainerLight = Color(0xFF001C38)

val SecondaryLight = Color(0xFF535F70)
val OnSecondaryLight = Color(0xFFFFFFFF)
val SecondaryContainerLight = Color(0xFFD7E3F8)
val OnSecondaryContainerLight = Color(0xFF101C2B)

val SurfaceLight = Color(0xFFF8F9FF)
val OnSurfaceLight = Color(0xFF191C20)
val SurfaceVariantLight = Color(0xFFDFE2EB)
val OnSurfaceVariantLight = Color(0xFF43474E)

val OutlineLight = Color(0xFF73777F)
val ErrorLight = Color(0xFFBA1A1A)

// Dark Scheme Colors
val PrimaryDark = Color(0xFFA2C9FF)
val OnPrimaryDark = Color(0xFF00315B)
val PrimaryContainerDark = Color(0xFF00487F)
val OnPrimaryContainerDark = Color(0xFFD3E4FF)

val SecondaryDark = Color(0xFFBBC7DB)
val OnSecondaryDark = Color(0xFF253141)
val SecondaryContainerDark = Color(0xFF3B4858)
val OnSecondaryContainerDark = Color(0xFFD7E3F8)

val SurfaceDark = Color(0xFF111418)
val OnSurfaceDark = Color(0xFFE1E2E8)
val SurfaceVariantDark = Color(0xFF43474E)
val OnSurfaceVariantDark = Color(0xFFC3C6CF)

val OutlineDark = Color(0xFF8D9199)
val ErrorDark = Color(0xFFFFB4AB)

// Priority Semantic Colors
val PriorityHigh = Color(0xFFDC2626)
val PriorityMedium = Color(0xFFD97706)
val PriorityLow = Color(0xFF16A34A)
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/theme/Theme.kt',
    name: 'Theme.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Material 3 Theme setup supporting Android 12+ Dynamic Theming.',
    content: `package com.taskpulse.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryDark,
    onPrimary = OnPrimaryDark,
    primaryContainer = PrimaryContainerDark,
    onPrimaryContainer = OnPrimaryContainerDark,
    secondary = SecondaryDark,
    onSecondary = OnSecondaryDark,
    secondaryContainer = SecondaryContainerDark,
    onSecondaryContainer = OnSecondaryContainerDark,
    surface = SurfaceDark,
    onSurface = OnSurfaceDark,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = OnSurfaceVariantDark,
    outline = OutlineDark,
    error = ErrorDark
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryLight,
    onPrimary = OnPrimaryLight,
    primaryContainer = PrimaryContainerLight,
    onPrimaryContainer = OnPrimaryContainerLight,
    secondary = SecondaryLight,
    onSecondary = OnSecondaryLight,
    secondaryContainer = SecondaryContainerLight,
    onSecondaryContainer = OnSecondaryContainerLight,
    surface = SurfaceLight,
    onSurface = OnSurfaceLight,
    surfaceVariant = SurfaceVariantLight,
    onSurfaceVariant = OnSurfaceVariantLight,
    outline = OutlineLight,
    error = ErrorLight
)

@Composable
fun TaskPulseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/screens/TaskListScreen.kt',
    name: 'TaskListScreen.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Primary Jetpack Compose Screen with Material 3 Scaffold, SwipeToDismissBox, and Filter Chips.',
    content: `package com.taskpulse.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.taskpulse.app.data.model.Task
import com.taskpulse.app.ui.components.EmptyTasksState
import com.taskpulse.app.ui.components.TaskCardItem
import com.taskpulse.app.ui.viewmodel.TaskFilter
import com.taskpulse.app.ui.viewmodel.TaskSort
import com.taskpulse.app.ui.viewmodel.TaskUiState

/**
 * Main TaskPulse Screen using Jetpack Compose Material Design 3.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TaskListScreen(
    uiState: TaskUiState,
    onFilterSelected: (TaskFilter) -> Unit,
    onSortSelected: (TaskSort) -> Unit,
    onSearchQueryChanged: (String) -> Unit,
    onToggleTask: (Task) -> Unit,
    onTaskClick: (Task) -> Unit,
    onDeleteTask: (Task) -> Unit,
    onAddTaskClick: () -> Unit,
    snackbarHostState: SnackbarHostState
) {
    var isSearchActive by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    if (isSearchActive) {
                        TextField(
                            value = uiState.searchQuery,
                            onValueChange = onSearchQueryChanged,
                            placeholder = { Text("Search tasks...") },
                            singleLine = true,
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = Color.Transparent,
                                unfocusedContainerColor = Color.Transparent
                            ),
                            trailingIcon = {
                                IconButton(onClick = {
                                    if (uiState.searchQuery.isNotEmpty()) {
                                        onSearchQueryChanged("")
                                    } else {
                                        isSearchActive = false
                                    }
                                }) {
                                    Icon(Icons.Default.Clear, contentDescription = "Close search")
                                }
                            }
                        )
                    } else {
                        Text(
                            text = "TaskPulse",
                            style = MaterialTheme.typography.titleLarge
                        )
                    }
                },
                actions = {
                    if (!isSearchActive) {
                        IconButton(onClick = { isSearchActive = true }) {
                            Icon(Icons.Default.Search, contentDescription = "Search tasks")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onAddTaskClick,
                icon = { Icon(Icons.Default.Add, contentDescription = "Add Task") },
                text = { Text("New Task") },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Horizontal Filter Chips Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TaskFilter.entries.forEach { filter ->
                    FilterChip(
                        selected = uiState.currentFilter == filter,
                        onClick = { onFilterSelected(filter) },
                        label = {
                            Text(
                                when (filter) {
                                    TaskFilter.ALL -> "All"
                                    TaskFilter.PENDING -> "Pending"
                                    TaskFilter.COMPLETED -> "Done"
                                    TaskFilter.HIGH_PRIORITY -> "High Priority"
                                    TaskFilter.TODAY -> "Due Today"
                                }
                            )
                        }
                    )
                }
            }

            // Task List or Empty State
            if (uiState.filteredTasks.isEmpty()) {
                EmptyTasksState(
                    isSearch = uiState.searchQuery.isNotEmpty(),
                    filter = uiState.currentFilter
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(
                        items = uiState.filteredTasks,
                        key = { it.id }
                    ) { task ->
                        // Swipe to delete with SwipeToDismissBox (Material 3)
                        val dismissState = rememberSwipeToDismissBoxState(
                            confirmValueChange = { dismissValue ->
                                if (dismissValue == SwipeToDismissBoxValue.EndToStart) {
                                    onDeleteTask(task)
                                    true
                                } else false
                            }
                        )

                        SwipeToDismissBox(
                            state = dismissState,
                            backgroundContent = {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(MaterialTheme.colorScheme.errorContainer, shape = MaterialTheme.shapes.medium)
                                        .padding(horizontal = 20.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Delete",
                                        tint = MaterialTheme.colorScheme.onErrorContainer
                                    )
                                }
                            },
                            enableDismissFromStartToEnd = false
                        ) {
                            TaskCardItem(
                                task = task,
                                onToggleComplete = { onToggleTask(task) },
                                onClick = { onTaskClick(task) }
                            )
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/screens/AddEditTaskSheet.kt',
    name: 'AddEditTaskSheet.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Material 3 ModalBottomSheet with Date & Time Pickers, Title validation, and Priority selection.',
    content: `package com.taskpulse.app.ui.screens

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.taskpulse.app.data.model.Priority
import com.taskpulse.app.data.model.Task
import java.text.SimpleDateFormat
import java.util.*

/**
 * ModalBottomSheet for creating or editing tasks.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditTaskSheet(
    task: Task?,
    onDismiss: () -> Unit,
    onSave: (id: Long, title: String, desc: String, dueDate: Long, priority: Priority, notify: Boolean) -> Unit
) {
    val context = LocalContext.current
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var title by remember { mutableStateOf(task?.title ?: "") }
    var description by remember { mutableStateOf(task?.description ?: "") }
    var priority by remember { mutableStateOf(task?.priority ?: Priority.MEDIUM) }
    var notificationEnabled by remember { mutableStateOf(task?.notificationEnabled ?: true) }
    var isTitleError by remember { mutableStateOf(false) }

    // Calendar for due date
    val calendar = remember {
        Calendar.getInstance().apply {
            if (task != null) {
                timeInMillis = task.dueDate
            } else {
                add(Calendar.HOUR_OF_DAY, 2)
            }
        }
    }
    var dueDateTimestamp by remember { mutableLongStateOf(calendar.timeInMillis) }

    val dateFormat = remember { SimpleDateFormat("EEE, MMM dd, yyyy", Locale.getDefault()) }
    val timeFormat = remember { SimpleDateFormat("hh:mm a", Locale.getDefault()) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .padding(bottom = 32.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = if (task == null) "Create Task" else "Edit Task",
                style = MaterialTheme.typography.titleLarge
            )

            // Title Input
            OutlinedTextField(
                value = title,
                onValueChange = {
                    title = it
                    if (it.isNotBlank()) isTitleError = false
                },
                label = { Text("Task Title *") },
                isError = isTitleError,
                supportingText = {
                    if (isTitleError) Text("Title is required")
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // Description Input
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description / Notes (Optional)") },
                minLines = 3,
                maxLines = 5,
                modifier = Modifier.fillMaxWidth()
            )

            // Priority Selector
            Text("Priority Level", style = MaterialTheme.typography.labelLarge)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Priority.entries.forEach { p ->
                    FilterChip(
                        selected = priority == p,
                        onClick = { priority = p },
                        label = { Text(p.displayName) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Date and Time Pickers
            Text("Due Date & Reminder", style = MaterialTheme.typography.labelLarge)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Date Button
                OutlinedButton(
                    onClick = {
                        val d = Calendar.getInstance().apply { timeInMillis = dueDateTimestamp }
                        DatePickerDialog(
                            context,
                            { _, year, month, dayOfMonth ->
                                d.set(Calendar.YEAR, year)
                                d.set(Calendar.MONTH, month)
                                d.set(Calendar.DAY_OF_MONTH, dayOfMonth)
                                dueDateTimestamp = d.timeInMillis
                            },
                            d.get(Calendar.YEAR),
                            d.get(Calendar.MONTH),
                            d.get(Calendar.DAY_OF_MONTH)
                        ).show()
                    },
                    modifier = Modifier.weight(1.3f)
                ) {
                    Icon(Icons.Default.CalendarToday, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(dateFormat.format(Date(dueDateTimestamp)))
                }

                // Time Button
                OutlinedButton(
                    onClick = {
                        val d = Calendar.getInstance().apply { timeInMillis = dueDateTimestamp }
                        TimePickerDialog(
                            context,
                            { _, hourOfDay, minute ->
                                d.set(Calendar.HOUR_OF_DAY, hourOfDay)
                                d.set(Calendar.MINUTE, minute)
                                dueDateTimestamp = d.timeInMillis
                            },
                            d.get(Calendar.HOUR_OF_DAY),
                            d.get(Calendar.MINUTE),
                            false
                        ).show()
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Schedule, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(timeFormat.format(Date(dueDateTimestamp)))
                }
            }

            // Notification Switch
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Push Notification Reminder", style = MaterialTheme.typography.bodyMedium)
                    Text("Alerts when task is due", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Switch(
                    checked = notificationEnabled,
                    onCheckedChange = { notificationEnabled = it }
                )
            }

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Cancel")
                }
                Button(
                    onClick = {
                        if (title.isBlank()) {
                            isTitleError = true
                        } else {
                            onSave(
                                task?.id ?: 0L,
                                title,
                                description,
                                dueDateTimestamp,
                                priority,
                                notificationEnabled
                            )
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text(if (task == null) "Create" else "Save")
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/components/TaskItem.kt',
    name: 'TaskItem.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Material 3 Task Card with priority accent, strike-through styling, and reminder indicators.',
    content: `package com.taskpulse.app.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.NotificationsOff
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.taskpulse.app.data.model.Priority
import com.taskpulse.app.data.model.Task
import com.taskpulse.app.ui.theme.PriorityHigh
import com.taskpulse.app.ui.theme.PriorityLow
import com.taskpulse.app.ui.theme.PriorityMedium
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun TaskCardItem(
    task: Task,
    onToggleComplete: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dateFormat = SimpleDateFormat("MMM d, h:mm a", Locale.getDefault())
    val isOverdue = !task.isCompleted && task.dueDate < System.currentTimeMillis()

    val priorityColor = when (task.priority) {
        Priority.HIGH -> PriorityHigh
        Priority.MEDIUM -> PriorityMedium
        Priority.LOW -> PriorityLow
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = if (task.isCompleted)
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
            else
                MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Completion Checkbox
            Checkbox(
                checked = task.isCompleted,
                onCheckedChange = { onToggleComplete() },
                colors = CheckboxDefaults.colors(
                    checkedColor = MaterialTheme.colorScheme.primary
                )
            )

            Spacer(Modifier.width(8.dp))

            // Task Info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        textDecoration = if (task.isCompleted) TextDecoration.LineThrough else TextDecoration.None,
                        fontWeight = if (task.isCompleted) FontWeight.Normal else FontWeight.SemiBold
                    ),
                    color = if (task.isCompleted)
                        MaterialTheme.colorScheme.onSurfaceVariant
                    else
                        MaterialTheme.colorScheme.onSurface
                )

                if (task.description.isNotBlank()) {
                    Text(
                        text = task.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2
                    )
                }

                Spacer(Modifier.height(6.dp))

                // Date & Priority row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = dateFormat.format(Date(task.dueDate)),
                        style = MaterialTheme.typography.labelSmall,
                        color = if (isOverdue) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "·",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.outline
                    )
                    Text(
                        text = task.priority.displayName,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        color = priorityColor
                    )
                }
            }

            // Notification indicator
            Icon(
                imageVector = if (task.notificationEnabled) Icons.Default.NotificationsActive else Icons.Default.NotificationsOff,
                contentDescription = if (task.notificationEnabled) "Notification set" else "No reminder",
                modifier = Modifier.size(18.dp),
                tint = if (task.notificationEnabled && !task.isCompleted)
                    MaterialTheme.colorScheme.primary
                else
                    MaterialTheme.colorScheme.outline
            )
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/components/EmptyState.kt',
    name: 'EmptyState.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Empty state illustration and guidance when no tasks match current filters.',
    content: `package com.taskpulse.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircleOutline
import androidx.compose.material.icons.filled.SearchOff
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.taskpulse.app.ui.viewmodel.TaskFilter

@Composable
fun EmptyTasksState(
    isSearch: Boolean,
    filter: TaskFilter
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = if (isSearch) Icons.Default.SearchOff else Icons.Default.CheckCircleOutline,
                contentDescription = null,
                modifier = Modifier.size(72.dp),
                tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f)
            )
            Spacer(Modifier.height(16.dp))
            Text(
                text = if (isSearch) "No tasks found" else when (filter) {
                    TaskFilter.COMPLETED -> "No completed tasks yet"
                    TaskFilter.PENDING -> "All caught up! No pending tasks"
                    TaskFilter.HIGH_PRIORITY -> "No high priority tasks"
                    TaskFilter.TODAY -> "No tasks due today"
                    TaskFilter.ALL -> "You have no tasks scheduled"
                },
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold)
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = if (isSearch)
                    "Try refining your search keyword"
                else
                    "Tap '+ New Task' below to create your first task",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Host Activity handling Android 13+ POST_NOTIFICATIONS runtime permissions and deep link navigation.',
    content: `package com.taskpulse.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.taskpulse.app.data.local.TaskPulseDatabase
import com.taskpulse.app.data.repository.TaskRepositoryImpl
import com.taskpulse.app.notification.AndroidAlarmScheduler
import com.taskpulse.app.ui.screens.AddEditTaskSheet
import com.taskpulse.app.ui.screens.TaskListScreen
import com.taskpulse.app.ui.theme.TaskPulseTheme
import com.taskpulse.app.ui.viewmodel.TaskViewModel
import com.taskpulse.app.ui.viewmodel.TaskViewModelFactory
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = TaskPulseDatabase.getDatabase(applicationContext)
        val alarmScheduler = AndroidAlarmScheduler(applicationContext)
        val repository = TaskRepositoryImpl(database.taskDao(), alarmScheduler)

        setContent {
            TaskPulseTheme {
                val viewModel: TaskViewModel = viewModel(
                    factory = TaskViewModelFactory(repository)
                )
                val uiState by viewModel.uiState.collectAsState()
                val snackbarHostState = remember { SnackbarHostState() }
                val scope = rememberCoroutineScope()

                // Android 13 (API 33+) Runtime Notification Permission Launcher
                val permissionLauncher = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.RequestPermission()
                ) { isGranted ->
                    if (!isGranted) {
                        Toast.makeText(
                            this,
                            "Notification permission denied. Reminders will not alert audibly.",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                // Request notification permission dynamically on launch
                LaunchedEffect(Unit) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        if (ContextCompat.checkSelfPermission(
                                this@MainActivity,
                                Manifest.permission.POST_NOTIFICATIONS
                            ) != PackageManager.PERMISSION_GRANTED
                        ) {
                            permissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                        }
                    }

                    // Handle deep link intent from notification tap
                    intent?.data?.let { uri ->
                        if (uri.scheme == "taskpulse" && uri.host == "task") {
                            val taskId = uri.lastPathSegment?.toLongOrNull()
                            if (taskId != null) {
                                val task = repository.getTaskById(taskId)
                                if (task != null) {
                                    viewModel.openEditTaskSheet(task)
                                }
                            }
                        }
                    }
                }

                // Show undo snackbar when task is deleted
                LaunchedEffect(uiState.recentlyDeletedTask) {
                    val deleted = uiState.recentlyDeletedTask
                    if (deleted != null) {
                        scope.launch {
                            val result = snackbarHostState.showSnackbar(
                                message = "Task deleted",
                                actionLabel = "Undo",
                                duration = SnackbarDuration.Short
                            )
                            if (result == SnackbarResult.ActionPerformed) {
                                viewModel.restoreDeletedTask()
                            }
                        }
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    TaskListScreen(
                        uiState = uiState,
                        onFilterSelected = viewModel::setFilter,
                        onSortSelected = viewModel::setSort,
                        onSearchQueryChanged = viewModel::onSearchQueryChanged,
                        onToggleTask = viewModel::toggleTaskCompletion,
                        onTaskClick = viewModel::openEditTaskSheet,
                        onDeleteTask = viewModel::deleteTask,
                        onAddTaskClick = viewModel::openAddTaskSheet,
                        snackbarHostState = snackbarHostState
                    )

                    if (uiState.isAddEditSheetOpen) {
                        AddEditTaskSheet(
                            task = uiState.selectedTaskForEdit,
                            onDismiss = viewModel::closeAddEditSheet,
                            onSave = viewModel::saveTask
                        )
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/TaskPulseApplication.kt',
    name: 'TaskPulseApplication.kt',
    language: 'kotlin',
    category: 'manifest',
    description: 'Application class initializing the high-priority notification channel at process startup.',
    content: `package com.taskpulse.app

import android.app.Application
import com.taskpulse.app.notification.NotificationHelper

/**
 * Custom Application class for TaskPulse.
 * Registers notification channels upon app startup.
 */
class TaskPulseApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        // Register notification channel for Android 8.0+
        NotificationHelper(this).createNotificationChannel()
    }
}
`
  },
  {
    path: 'app/src/main/java/com/taskpulse/app/ui/viewmodel/TaskViewModelFactory.kt',
    name: 'TaskViewModelFactory.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'ViewModelProvider.Factory enabling dependency injection of the repository into TaskViewModel.',
    content: `package com.taskpulse.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.taskpulse.app.data.repository.TaskRepository

/**
 * Factory class to instantiate TaskViewModel with TaskRepository dependency.
 */
class TaskViewModelFactory(
    private val repository: TaskRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(TaskViewModel::class.java)) {
            return TaskViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class: \${modelClass.name}")
    }
}
`
  },
  {
    path: 'README.md',
    name: 'README.md (Setup Guide)',
    language: 'markdown',
    category: 'docs',
    description: 'Step-by-step instructions to open, build, and run the project in Android Studio.',
    content: `# TaskPulse - Kotlin Jetpack Compose Android To-Do App

TaskPulse is a modern, production-grade Android To-Do application built in Kotlin, using Jetpack Compose, Room Persistence Library, MVVM Architecture with StateFlow, and reliable local background scheduling via AlarmManager and WorkManager.

---

## Technical Stack & Architecture

- **Language:** Kotlin 2.0+
- **UI Toolkit:** Jetpack Compose with Material Design 3
- **Local Database:** Room Persistence Library (SQLite) with KSP annotation processing
- **Architecture:** MVVM (Model-View-ViewModel) + Reactive Streams (Kotlin Coroutines \`StateFlow\` & \`SharedFlow\`)
- **Background Scheduling:** \`AlarmManager\` (\`setExactAndAllowWhileIdle\`) for reliable Doze-resistant notifications, with \`BootReceiver\` to automatically restore alarms upon device reboot
- **System Notifications:** Dynamic \`POST_NOTIFICATIONS\` permission handler (Android 13+ / API 33) and high-priority \`NotificationChannel\` (Android 8.0+ / API 26)

---

## Step-by-Step Android Studio Setup Guide

### 1. Prerequisites
- **Android Studio:** Hedgehog (2023.1.1) or newer (Iguana, Jellyfish, Koala, Ladybug)
- **JDK:** Java 17 or Java 21 (bundled with modern Android Studio)
- **Android SDK:** Compile SDK 35, Target SDK 35, Min SDK 24 (Android 7.0+)

### 2. Import into Android Studio
1. Unzip the downloaded \`TaskPulse_Android_Project.zip\` or clone the repository into your desired workspace folder.
2. Launch Android Studio.
3. On the welcome screen, select **Open** (or **File > Open** if already open).
4. Browse to the unzipped root directory containing \`settings.gradle.kts\` and \`build.gradle.kts\`.
5. Click **OK**. Android Studio will initialize the Gradle wrapper and trigger Gradle Sync.

### 3. Grant Exact Alarm Permission (Android 12+)
On Android 12 (API 31) and higher, exact alarms require user authorization:
- The app requests \`SCHEDULE_EXACT_ALARM\` and \`USE_EXACT_ALARM\` in \`AndroidManifest.xml\`.
- To test exact reminders, navigate to **Settings > Apps > TaskPulse > Alarms & reminders** and ensure **Allow setting alarms and reminders** is toggled ON.

### 4. Running the App
1. Connect a physical Android device via USB debugging or start an Android Virtual Device (AVD) running Android 13+ (Pixel 8 recommended).
2. Click the green **Run (Shift + F10)** button in Android Studio.
3. Upon first launch, the app prompts for the **Notification Permission** dialog. Tap **Allow** to enable reminders.

---

## Key Features Breakdown

| Feature | Implementation Details |
|---|---|
| **Room Persistence** | \`@Entity Task\`, \`TaskDao\` emitting reactive \`Flow<List<Task>>\`, Singleton \`TaskPulseDatabase\` with \`fallbackToDestructiveMigration()\` |
| **StateFlow MVVM** | \`TaskViewModel\` maintains an immutable \`TaskUiState\` StateFlow with search, filtering, and sorting |
| **Material 3 UI** | \`Scaffold\`, \`SwipeToDismissBox\` (swipe left to delete with undo snackbar), \`ModalBottomSheet\` with date/time pickers |
| **Exact Reminders** | \`AlarmScheduler\` using \`AlarmManager.setExactAndAllowWhileIdle\` to fire even during Android Doze mode |
| **Boot Persistence** | \`BootReceiver\` listening to \`ACTION_BOOT_COMPLETED\` to reschedule all pending tasks after device restart |
| **Deep Linking** | Tapping a notification opens \`MainActivity\` directly to the specific task details sheet |
`
  }
];
