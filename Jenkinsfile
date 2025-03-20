node {
    environment {
        SONARQUBE_SERVER = 'sonarqube'
        NEXUS_REPO_URL = '192.168.1.65:8082'
        IMAGE_NAME = 'docker-repo/fe_admin'
        CONTAINER_NAME = "fe_admin_container"
    }

    try {
        stage('Clone Repository') {
            git branch: 'main', credentialsId: 'new-git-id', url: 'https://github.com/Zinnext/Fe_-Admin_DevOps.git'
        }

        stage('SonarQube Analysis') {
            withSonarQubeEnv('sonarqube') {
                withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    /opt/sonar-scanner/bin/sonar-scanner \
                    -Dsonar.projectKey=fe_admin \
                    -Dsonar.projectName="Fe_Admin" \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=http://192.168.1.65:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Get Latest Image Version') {
            script {
                def latestTag = sh(script: """
                    curl -s -u "$NEXUS_USER:$NEXUS_PASS" http://${NEXUS_REPO_URL}/v2/${IMAGE_NAME}/tags/list | \
                    jq -r '.tags | if type == "array" and length > 0 then sort | last else empty end'
                """, returnStdout: true).trim()

                env.IMAGE_VERSION = latestTag ? "v0." + (latestTag.tokenize('.')[1].toInteger() + 1) : "v0.1"
                echo "New image version: ${env.IMAGE_VERSION}"
            }
        }

        stage('Build & Push Docker Image') {
            withCredentials([usernamePassword(credentialsId: 'nexus_docker_id', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                sh """
                docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} .
                echo "$NEXUS_PASS" | docker login -u "$NEXUS_USER" --password-stdin ${NEXUS_REPO_URL}
                docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
                docker push ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
                """
            }
        }

        stage('Deploy New Container') {
            sh """
            docker pull ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
            docker stop "$CONTAINER_NAME" || true
            docker rm "$CONTAINER_NAME" || true
            docker rmi \$(docker images -q ${IMAGE_NAME}) || true
            docker run -d --name "$CONTAINER_NAME" -p 4001:4001 ${NEXUS_REPO_URL}/${IMAGE_NAME}:${IMAGE_VERSION}
            """
        }
    } catch (Exception e) {
        echo "Pipeline execution failed: ${e.message}"
        currentBuild.result = 'FAILURE'
    }
}
