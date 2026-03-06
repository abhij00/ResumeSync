
def required_skills_by_job(job_id):
    job_skills = {
        1: ["Java", "Spring", "Hibernate"],
        2: ["React", "JavaScript", "CSS"],
        3: ["Python", "Machine Learning", "SQL"]
    }
    return job_skills.get(job_id, [])