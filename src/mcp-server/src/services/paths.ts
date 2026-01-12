/**
 * Path Service
 *
 * Centralized path construction for topic-related files.
 * All tools should use these functions to ensure consistent paths.
 *
 * Standard: All topic data lives under "topics/" directory.
 */

/**
 * Base directory for all topic content
 */
export const TOPICS_BASE_PATH = "topics";

/**
 * Get the path to a topic directory.
 * Handles both simple topics (e.g., "docker") and subtopics (e.g., "aws/ec2").
 *
 * @param topic - Topic name or path (e.g., "docker" or "aws/ec2")
 * @returns Path to the topic directory (e.g., "topics/docker" or "topics/aws/subtopics/ec2")
 */
export function getTopicPath(topic: string): string {
  if (topic.includes("/")) {
    const [parent, child] = topic.split("/");
    return `${TOPICS_BASE_PATH}/${parent}/subtopics/${child}`;
  }
  return `${TOPICS_BASE_PATH}/${topic}`;
}

/**
 * Get the path to a topic's progress.yaml file.
 *
 * @param topic - Topic name or path
 * @returns Path to progress.yaml
 */
export function getProgressPath(topic: string): string {
  return `${getTopicPath(topic)}/progress.yaml`;
}

/**
 * Get the path to a topic's rewards.yaml file.
 *
 * @param topic - Topic name or path
 * @returns Path to rewards.yaml
 */
export function getRewardsPath(topic: string): string {
  return `${getTopicPath(topic)}/rewards.yaml`;
}

/**
 * Get the path to a course file.
 *
 * @param topic - Topic name
 * @param level - Level name (starter, beginner, advanced, expert)
 * @param courseId - Course ID (e.g., "01-first-container")
 * @returns Path to the course markdown file
 */
export function getCoursePath(topic: string, level: string, courseId: string): string {
  return `${getTopicPath(topic)}/courses/${level}/${courseId}.md`;
}

/**
 * Get the path to an exercise directory.
 *
 * @param topic - Topic name
 * @param level - Level name
 * @param courseId - Course ID
 * @param exerciseId - Exercise ID (e.g., "exercice-01")
 * @returns Path to the exercise directory
 */
export function getExercisePath(topic: string, level: string, courseId: string, exerciseId: string): string {
  return `${getTopicPath(topic)}/exercices/${level}/${courseId}/${exerciseId}`;
}
